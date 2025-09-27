import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  CallToolRequest,
  CallToolResult,
  ListToolsRequest,
  ListResourcesRequest,
  ReadResourceRequest,
  Tool,
  Resource,
} from '@modelcontextprotocol/sdk/types.js';

export interface ServerHandlers {
  toolCall: (request: CallToolRequest) => Promise<CallToolResult>;
  listTools: (request: ListToolsRequest) => Promise<{ tools: Tool[] }>;
  listResources: (
    request: ListResourcesRequest,
  ) => Promise<{ resources: Resource[] }>;
  readResource: (
    request: ReadResourceRequest,
  ) => Promise<{ contents: Resource[] }>;
}

// Start the server
export async function startServer(handlers: ServerHandlers): Promise<Server> {
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
  server.setRequestHandler(ListToolsRequestSchema, handlers.listTools);

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, handlers.toolCall);

  // List available resources
  server.setRequestHandler(ListResourcesRequestSchema, handlers.listResources);

  // Handle resource reading
  server.setRequestHandler(ReadResourceRequestSchema, handlers.readResource);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Simple MCP Server running on stdio');
  return server;
}
