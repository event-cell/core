#!/bin/bash

# Example script to demonstrate how to use the CLI client

# Process event IDs from 1 to 5
# echo "Processing event IDs from 1 to 5..."
# yarn start process-events -s 1 -e 5

# Process event IDs from 10 to 15 with a custom delay
echo "Processing event IDs from 10 to 15 with a custom delay..."
yarn start process-events -s 81 -e 86 -d 2000 -u http://localhost:3000
# Process event IDs from 20 to 25 with a custom server URL
# echo "Processing event IDs from 20 to 25 with a custom server URL..."
# yarn start process-events -s 20 -e 25 -u http://example.com 
