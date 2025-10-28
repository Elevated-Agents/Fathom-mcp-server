import assert from "node:assert";
import { spawn } from "node:child_process";
import { describe, it } from "node:test";

describe("MCP Server Integration", () => {
	it("should initialize the server", async () => {
		const server = spawn("node", ["dist/index.js"]);

		const initRequest = {
			jsonrpc: "2.0",
			id: 1,
			method: "initialize",
			params: {
				protocolVersion: "2024-11-05",
				capabilities: {},
				clientInfo: {
					name: "test-client",
					version: "1.0.0",
				},
			},
		};

		// Send initialize request
		server.stdin.write(`${JSON.stringify(initRequest)}\n`);

		// Wait for response
		await new Promise((resolve) => {
			server.stdout.once("data", (data) => {
				const response = JSON.parse(data.toString());
				assert.strictEqual(response.id, 1);
				assert.ok(response.result);
				assert.strictEqual(
					response.result.serverInfo.name,
					"fathom-mcp-server",
				);
				resolve(null);
			});
		});

		server.kill();
	});

	it("should list available tools", async () => {
		const server = spawn("node", ["dist/index.js"]);

		// First initialize
		const initRequest = {
			jsonrpc: "2.0",
			id: 1,
			method: "initialize",
			params: {
				protocolVersion: "2024-11-05",
				capabilities: {},
				clientInfo: {
					name: "test-client",
					version: "1.0.0",
				},
			},
		};

		server.stdin.write(`${JSON.stringify(initRequest)}\n`);

		// Wait for init response
		await new Promise((resolve) => {
			server.stdout.once("data", () => resolve(null));
		});

		// Send initialized notification
		const initializedNotif = {
			jsonrpc: "2.0",
			method: "notifications/initialized",
		};
		server.stdin.write(`${JSON.stringify(initializedNotif)}\n`);

		// Request tools list
		const listToolsRequest = {
			jsonrpc: "2.0",
			id: 2,
			method: "tools/list",
			params: {},
		};

		server.stdin.write(`${JSON.stringify(listToolsRequest)}\n`);

		// Wait for tools list response
		await new Promise((resolve) => {
			let buffer = "";
			const listener = (data: Buffer) => {
				buffer += data.toString();
				const lines = buffer.split("\n");

				for (const line of lines) {
					if (line.trim()) {
						try {
							const response = JSON.parse(line);
							if (response.id === 2) {
								assert.ok(response.result);
								assert.ok(Array.isArray(response.result.tools));
								assert.strictEqual(response.result.tools.length, 1);
								assert.strictEqual(response.result.tools[0].name, "hello");
								server.stdout.off("data", listener);
								resolve(null);
								return;
							}
						} catch (_e) {
							// Ignore parse errors, continue accumulating
						}
					}
				}
			};

			server.stdout.on("data", listener);
		});

		server.kill();
	});
});
