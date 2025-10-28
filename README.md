# Fathom-mcp-server

Fathom meeting transcription MCP server - A basic hello world implementation of the Model Context Protocol (MCP).

## Overview

This is a minimal MCP server implementation that demonstrates:
- A simple "hello" tool that greets users
- A basic greeting resource
- TypeScript with strict type checking
- Biome for linting and formatting
- Native Node.js test runner for tests

## Installation

```bash
npm install
```

## Development

```bash
# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Run manual test (demonstrates server functionality)
npx tsx src/manual-test.ts

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Usage

### Running the server

```bash
npm start
```

The server runs using stdio transport, which is ideal for use with MCP clients like Claude Desktop.

### Testing with MCP Inspector

You can test the server using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Available Tools

### hello
Says hello to a given name.

**Input Schema:**
- `name` (string): The name to greet

**Output:**
- `greeting` (string): A personalized greeting message

## Available Resources

### greeting://default
A simple greeting message resource.

## Tech Stack

- **Runtime**: Node.js
- **Package Manager**: NPM
- **Language**: TypeScript
- **Linter/Formatter**: Biome
- **Testing**: Native Node.js test runner
- **MCP SDK**: @modelcontextprotocol/sdk

## License

ISC

