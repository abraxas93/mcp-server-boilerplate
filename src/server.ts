import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
  handleToolCall,
  handleListTools,
  handleListResources,
  handleReadResource,
} from './handlers';

// Create the server instance
const server = new Server(
  {
    name: 'simple-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  },
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, handleListTools);

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, handleToolCall);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, handleListResources);

// Handle resource reading
server.setRequestHandler(ReadResourceRequestSchema, handleReadResource);

// Start the server
export async function startServer(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Simple MCP Server running on stdio');
}
