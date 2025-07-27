# Event Cell CLI Client

A command-line client for processing a range of event IDs in the Event Cell application.

## Installation

```bash
# Install dependencies
yarn install

# Build the project
yarn build
```

## Usage

```bash
# Process a range of event IDs
yarn start process-events -s 1 -e 10

# Process a range of event IDs with custom server URL and delay
yarn start process-events -s 1 -e 10 -u http://example.com -d 2000

# Process a range of event IDs with live timing upload disabled
yarn start process-events -s 1 -e 10 --no-upload
```

### Options

- `-s, --start <number>`: Starting event ID (required)
- `-e, --end <number>`: Ending event ID (required)
- `-u, --url <url>`: Server URL (default: http://localhost:8080)
- `-d, --delay <number>`: Delay between requests in milliseconds (default: 1000)
- `--no-upload`: Disable live timing upload (enabled by default)

## Development

```bash
# Run in development mode
yarn dev process-events -s 1 -e 10
```

## Building

```bash
# Build the project
yarn build
```

## License

This project is licensed under the same license as the Event Cell application. 