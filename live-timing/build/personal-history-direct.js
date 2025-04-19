#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

try {
  console.log('Building personal history site...');
  
  // Ensure we're in the live-timing directory
  const liveTimingDir = path.join(__dirname, '..');
  process.chdir(liveTimingDir);
  
  // Run the build process
  console.log('Running TypeScript and Vite build...');
  execSync('yarn build', { stdio: 'inherit' });
  
  // Create target directory
  console.log('Creating target directories...');
  const targetDir = path.join(__dirname, '../../server/dist/ui/personal-history');
  fs.mkdirSync(targetDir, { recursive: true });
  
  // Create static directory structure
  const staticDir = path.join(__dirname, '../../server/dist/ui/static/personal-history');
  fs.mkdirSync(staticDir, { recursive: true });
  
  // Copy built files to target directory
  console.log('Copying built files...');
  const distDir = path.join(__dirname, '../dist/personal-history');
  if (!fs.existsSync(distDir)) {
    throw new Error(`Build directory ${distDir} does not exist. Build may have failed.`);
  }
  execSync(`cp -r ${distDir}/* ${targetDir}/`, { stdio: 'inherit' });
  
  // Create remote directories
  console.log('Creating remote directories...');
  execSync('ssh -i /data/.ssh/id_rsa sdma-web@170.64.246.68 "mkdir -p /home/sdma-web/websites/timing/static/personal-history"', { stdio: 'inherit' });
  
  // Sync index.html to root
  console.log('Syncing index.html...');
  execSync('rsync -avz --delete -e "ssh -i /data/.ssh/id_rsa" ../../server/dist/ui/personal-history/index.html sdma-web@170.64.246.68:/home/sdma-web/websites/timing/static/personal-history/', { stdio: 'inherit' });
  
  console.log('Personal history site built and deployed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  if (error.stdout) console.error('stdout:', error.stdout.toString());
  if (error.stderr) console.error('stderr:', error.stderr.toString());
  process.exit(1);
} 