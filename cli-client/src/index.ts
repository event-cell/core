#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import ora from 'ora';
import chalk from 'chalk';

// Define the program
const program = new Command();

program
  .name('event-cell-cli')
  .description('CLI client for Event Cell')
  .version('1.0.0');

program
  .command('process-events')
  .description('Process a range of event IDs')
  .requiredOption('-s, --start <number>', 'Starting event ID')
  .requiredOption('-e, --end <number>', 'Ending event ID')
  .option('-u, --url <url>', 'Server URL', 'http://localhost:8080')
  .option('-d, --delay <number>', 'Delay between requests in milliseconds', '1000')
  .option('--no-upload', 'Disable live timing upload')
  .action(async (options) => {
    const startId = parseInt(options.start, 10);
    const endId = parseInt(options.end, 10);
    const serverUrl = options.url;
    const delay = parseInt(options.delay, 10);
    const uploadEnabled = options.upload;

    if (isNaN(startId) || isNaN(endId) || isNaN(delay)) {
      console.error(chalk.red('Error: Invalid input. Please provide valid numbers.'));
      process.exit(1);
    }

    if (startId > endId) {
      console.error(chalk.red('Error: Start ID must be less than or equal to End ID.'));
      process.exit(1);
    }

    console.log(chalk.blue(`Processing event IDs from ${startId} to ${endId}`));
    console.log(chalk.blue(`Server URL: ${serverUrl}`));
    console.log(chalk.blue(`Delay between requests: ${delay}ms`));
    console.log(chalk.blue(`Live timing upload: ${uploadEnabled ? 'Enabled' : 'Disabled'}`));

    // Activate upload live timing if enabled
    if (uploadEnabled) {
      const uploadSpinner = ora('Activating live timing upload...').start();
      try {
        await axios.post(`${serverUrl}/api/v1/config.set`, {
          uploadLiveTiming: true
        });
        uploadSpinner.succeed('Live timing upload activated');
      } catch (error: any) {
        uploadSpinner.fail('Failed to activate live timing upload');
        console.error(chalk.red(`Error: ${error.message || 'Unknown error'}`));
        process.exit(1);
      }
    }

    for (let eventId = startId; eventId <= endId; eventId++) {
      const formattedEventId = eventId.toString().padStart(3, '0');
      const spinner = ora(`Processing event ID: ${formattedEventId}`).start();

      try {
        // Update the event ID
        await axios.post(`${serverUrl}/api/v1/config.set`, {
          eventId: formattedEventId
        });

        // Wait for a moment to allow the server to process the request
        await new Promise(resolve => setTimeout(resolve, delay));

        // Get the event configuration data
        const configResponse = await axios.get(`${serverUrl}/api/v1/config.get`);
        
        // Extract event name and date from the nested response structure
        // Strip trailing carriage return from event name
        const rawEventName = configResponse.data.result?.data?.eventName || 'Unknown Event';
        const eventName = rawEventName.replace(/\r\n$/, '');
        const eventDate = configResponse.data.result?.data?.eventDate || 'Unknown Date';

        // Get the competitor data
        const competitorsResponse = await axios.get(`${serverUrl}/api/simple/competitors.json`);
        const competitors = competitorsResponse.data;

        // Get the current competitor data
        const currentCompetitorResponse = await axios.get(`${serverUrl}/api/simple/currentCompetitor.json`);
        const currentCompetitor = currentCompetitorResponse.data;

        // Calculate the maximum number of runs based on the run numbers
        const maxRuns = competitors.reduce((max: number, competitor: any) => {
          // Find the highest run number in the competitor's times array
          const highestRunNumber = competitor.times.reduce((highest: number, time: any) => {
            return time && time.run > highest ? time.run : highest;
          }, 0);
          return highestRunNumber > max ? highestRunNumber : max;
        }, 0);

        spinner.succeed(`Event ID: ${formattedEventId}`);
        
        // Print the output
        console.log(chalk.green(`Event ID: ${formattedEventId}`));
        console.log(chalk.cyan(`Event Name: ${eventName}`));
        console.log(chalk.cyan(`Event Date: ${eventDate}`));
        console.log(chalk.yellow(`Number of competitors: ${competitors.length}`));
        console.log(chalk.yellow(`Current competitor: ${currentCompetitor}`));
        console.log(chalk.yellow(`Maximum number of runs: ${maxRuns}`));
        console.log(chalk.gray('-----------------------------------'));
      } catch (error: any) {
        spinner.fail(`Failed to process event ID: ${formattedEventId}`);
        console.error(chalk.red(`Error: ${error.message || 'Unknown error'}`));
        console.log(chalk.gray('-----------------------------------'));
      }
    }

    // Deactivate upload live timing if it was enabled
    if (uploadEnabled) {
      const uploadSpinner = ora('Deactivating live timing upload...').start();
      try {
        await axios.post(`${serverUrl}/api/v1/config.set`, {
          uploadLiveTiming: false
        });
        uploadSpinner.succeed('Live timing upload deactivated');
      } catch (error: any) {
        uploadSpinner.fail('Failed to deactivate live timing upload');
        console.error(chalk.red(`Error: ${error.message || 'Unknown error'}`));
      }
    }

    console.log(chalk.green('Processing complete!'));
  });

// Parse command line arguments
program.parse(process.argv); 