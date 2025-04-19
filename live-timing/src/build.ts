import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import { IndexPage } from './pages/IndexPage';
import { config } from 'server/src/config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Fetches event directories from the remote server during build time
 */
async function fetchEventDirectories(): Promise<string[]> {
  try {
    // Check if we have the necessary rsync configuration
    if (!config.rsyncRemoteHost || !config.rsyncRemoteUser || !config.rsyncRemotePath) {
      console.warn('Rsync configuration is incomplete. Cannot list directories from remote server.');
      return [];
    }

    // Use SSH to list directories on the remote server
    const sshCommand = `ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "ls -la ${config.rsyncRemotePath}/ | grep '^d' | grep -E '^d.*[0-9]{4}-[0-9]{2}-[0-9]{2}$' | awk '{print \\$9}'"`;
    
    console.log(`Executing SSH command to list directories: ${sshCommand}`);
    const { stdout, stderr } = await execAsync(sshCommand);
    
    if (stderr) {
      console.warn(`SSH command warnings: ${stderr}`);
    }
    
    // Parse the directory list
    const directories = stdout
      .trim()
      .split('\n')
      .filter(dir => dir && /^\d{4}-\d{2}-\d{2}$/.test(dir))
      .sort()
      .reverse(); // Most recent first
    
    console.log(`Found ${directories.length} event directories on remote server`);
    return directories;
  } catch (error) {
    console.error('Failed to get event directories from remote server:', error);
    return [];
  }
}

/**
 * Fetches metadata for a specific event from the remote server
 */
async function fetchEventMetadata(dateStr: string): Promise<any> {
  try {
    const sshCommand = `ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no ${config.rsyncRemoteUser}@${config.rsyncRemoteHost} "cat ${config.rsyncRemotePath}/${dateStr}/metadata.json"`;
    const { stdout } = await execAsync(sshCommand);
    return JSON.parse(stdout);
  } catch (error) {
    console.error(`Failed to fetch metadata for ${dateStr}:`, error);
    return null;
  }
}

/**
 * Builds the live-timing static site
 * @param outputDir Directory to output the static site
 */
export const buildLiveTimingSite = async (outputDir: string): Promise<void> => {
  console.log('Building live-timing static site...');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Fetch event data during build time
  const eventDirectories = await fetchEventDirectories();
  
  // Fetch metadata for all events
  const metadataMap: Record<string, any> = {};
  console.log(`Fetching metadata for ${eventDirectories.length} events...`);
  
  for (let i = 0; i < eventDirectories.length; i++) {
    const dateStr = eventDirectories[i];
    // Use process.stdout.write to update on the same line
    process.stdout.write(`\rFetching metadata: ${i + 1}/${eventDirectories.length} (${dateStr})`);
    metadataMap[dateStr] = await fetchEventMetadata(dateStr);
  }
  // Add a newline after the progress counter
  console.log('');
  
  // Read the CSS file
  const cssPath = path.resolve(__dirname, 'styles.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  
  // Generate HTML with the event data embedded
  const html = ReactDOMServer.renderToString(
    React.createElement(IndexPage, { 
      initialEventDirectories: eventDirectories,
      initialMetadataMap: metadataMap
    })
  );
  
  // Create the full HTML document with React and necessary JavaScript
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SDMA Live Timing</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <style>
    ${css}
  </style>
  <script>
    // Embed the event data directly in the HTML
    window.__INITIAL_EVENT_DATA__ = ${JSON.stringify({
      directories: eventDirectories,
      metadataMap: metadataMap
    })};
  </script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script>
    // Initialize the rolldown functionality
    document.addEventListener('DOMContentLoaded', function() {
      // Add click event listeners to all year headers
      const yearHeaders = document.querySelectorAll('.year-header');
      yearHeaders.forEach(header => {
        header.addEventListener('click', function() {
          const yearContent = this.nextElementSibling;
          if (yearContent && yearContent.classList.contains('year-content')) {
            yearContent.classList.toggle('active');
            const toggleIcon = this.querySelector('.toggle-icon');
            if (toggleIcon) {
              toggleIcon.textContent = yearContent.classList.contains('active') ? '▲' : '▼';
            }
          }
        });
      });
    });
  </script>
</head>
<body>
  ${html}
</body>
</html>`;
  
  // Write the HTML file
  const indexPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(indexPath, fullHtml);
  
  console.log(`Live-timing static site built at ${indexPath}`);
}; 