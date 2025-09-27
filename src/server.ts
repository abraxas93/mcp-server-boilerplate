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
import { IContainer } from './container/index.js';

// Start the server
export async function startServer(container: IContainer): Promise<Server> {
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
  server.setRequestHandler(
    ListToolsRequestSchema,
    handleListTools.bind(container),
  );

  // Handle tool calls
  server.setRequestHandler(
    CallToolRequestSchema,
    handleToolCall.bind(container),
  );

  // List available resources
  server.setRequestHandler(
    ListResourcesRequestSchema,
    handleListResources.bind(container),
  );

  // Handle resource reading
  server.setRequestHandler(
    ReadResourceRequestSchema,
    handleReadResource.bind(container),
  );
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Simple MCP Server running on stdio');
  return server;
}
