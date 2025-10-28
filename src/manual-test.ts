#!/usr/bin/env node

/**
 * Simple manual test script to verify the MCP server works
 * This script sends basic requests to the server and shows the responses
 */

import { spawn } from "node:child_process";

const server = spawn("node", ["dist/index.js"]);

let responseBuffer = "";

// Collect server responses
server.stdout.on("data", (data) => {
	responseBuffer += data.toString();
	const lines = responseBuffer.split("\n");

	// Process complete JSON responses
	for (let i = 0; i < lines.length - 1; i++) {
		const line = lines[i].trim();
		if (line) {
			try {
				const response = JSON.parse(line);
				console.log("\n📨 Server Response:");
				console.log(JSON.stringify(response, null, 2));
			} catch (e) {
				console.log("Raw:", line);
			}
		}
	}

	// Keep the last incomplete line
	responseBuffer = lines[lines.length - 1];
});

server.stderr.on("data", (data) => {
	console.log(`\n🔍 Server Log: ${data.toString().trim()}`);
});

// Test sequence
async function runTests() {
	// 1. Initialize
	console.log("\n\n=== Test 1: Initialize Server ===");
	const initRequest = {
		jsonrpc: "2.0",
		id: 1,
		method: "initialize",
		params: {
			protocolVersion: "2024-11-05",
			capabilities: {},
			clientInfo: {
				name: "manual-test",
				version: "1.0.0",
			},
		},
	};
	console.log("\n📤 Sending:", JSON.stringify(initRequest, null, 2));
	server.stdin.write(`${JSON.stringify(initRequest)}\n`);

	await new Promise((resolve) => setTimeout(resolve, 500));

	// 2. Send initialized notification
	console.log("\n\n=== Test 2: Send Initialized Notification ===");
	const initializedNotif = {
		jsonrpc: "2.0",
		method: "notifications/initialized",
	};
	console.log("\n📤 Sending:", JSON.stringify(initializedNotif, null, 2));
	server.stdin.write(`${JSON.stringify(initializedNotif)}\n`);

	await new Promise((resolve) => setTimeout(resolve, 500));

	// 3. List tools
	console.log("\n\n=== Test 3: List Available Tools ===");
	const listToolsRequest = {
		jsonrpc: "2.0",
		id: 2,
		method: "tools/list",
	};
	console.log("\n📤 Sending:", JSON.stringify(listToolsRequest, null, 2));
	server.stdin.write(`${JSON.stringify(listToolsRequest)}\n`);

	await new Promise((resolve) => setTimeout(resolve, 500));

	// 4. Call the hello tool
	console.log("\n\n=== Test 4: Call Hello Tool ===");
	const callToolRequest = {
		jsonrpc: "2.0",
		id: 3,
		method: "tools/call",
		params: {
			name: "hello",
			arguments: {
				name: "World",
			},
		},
	};
	console.log("\n📤 Sending:", JSON.stringify(callToolRequest, null, 2));
	server.stdin.write(`${JSON.stringify(callToolRequest)}\n`);

	await new Promise((resolve) => setTimeout(resolve, 500));

	// 5. List resources
	console.log("\n\n=== Test 5: List Available Resources ===");
	const listResourcesRequest = {
		jsonrpc: "2.0",
		id: 4,
		method: "resources/list",
	};
	console.log("\n📤 Sending:", JSON.stringify(listResourcesRequest, null, 2));
	server.stdin.write(`${JSON.stringify(listResourcesRequest)}\n`);

	await new Promise((resolve) => setTimeout(resolve, 500));

	// 6. Read the greeting resource
	console.log("\n\n=== Test 6: Read Greeting Resource ===");
	const readResourceRequest = {
		jsonrpc: "2.0",
		id: 5,
		method: "resources/read",
		params: {
			uri: "greeting://default",
		},
	};
	console.log("\n📤 Sending:", JSON.stringify(readResourceRequest, null, 2));
	server.stdin.write(`${JSON.stringify(readResourceRequest)}\n`);

	await new Promise((resolve) => setTimeout(resolve, 1000));

	console.log("\n\n=== Tests Complete ===\n");
	server.kill();
	process.exit(0);
}

// Start tests
runTests().catch((error) => {
	console.error("Test error:", error);
	server.kill();
	process.exit(1);
});
