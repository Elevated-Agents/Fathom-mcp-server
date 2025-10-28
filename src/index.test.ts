import assert from "node:assert";
import { describe, it } from "node:test";

describe("Fathom MCP Server", () => {
	it("should pass a basic sanity check", () => {
		assert.strictEqual(1 + 1, 2);
	});

	it("should construct greeting message", () => {
		const name = "World";
		const greeting = `Hello, ${name}! Welcome to the Fathom MCP Server.`;
		assert.strictEqual(
			greeting,
			"Hello, World! Welcome to the Fathom MCP Server.",
		);
	});

	it("should construct resource text", () => {
		const resourceText =
			"Hello from Fathom MCP Server! This is a basic hello world implementation.";
		assert.ok(resourceText.includes("Fathom MCP Server"));
		assert.ok(resourceText.includes("hello world"));
	});
});
