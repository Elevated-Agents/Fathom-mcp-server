#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create the MCP server
const server = new McpServer({
	name: "fathom-mcp-server",
	version: "1.0.0",
});

// Register a simple hello tool
server.registerTool(
	"hello",
	{
		title: "Hello Tool",
		description: "Says hello to a given name",
		inputSchema: {
			name: z.string().describe("The name to greet"),
		},
		outputSchema: {
			greeting: z.string(),
		},
	},
	async ({ name }) => {
		const output = {
			greeting: `Hello, ${name}! Welcome to the Fathom MCP Server.`,
		};
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(output),
				},
			],
			structuredContent: output,
		};
	},
);

// Register a simple greeting resource
server.registerResource(
	"greeting",
	"greeting://default",
	{
		title: "Default Greeting",
		description: "A simple greeting message",
		mimeType: "text/plain",
	},
	async (uri) => ({
		contents: [
			{
				uri: uri.href,
				text: "Hello from Fathom MCP Server! This is a basic hello world implementation.",
			},
		],
	}),
);

// Start the server with stdio transport
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Fathom MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Server error:", error);
	process.exit(1);
});
