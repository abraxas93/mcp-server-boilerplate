import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Start the server
export async function startServer(handlers: IServerHandlers): Promise<Server> {
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
        prompts: {},
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

  // Handle prompt listing
  server.setRequestHandler(ListPromptsRequestSchema, handlers.listPrompts);

  // Handle prompt getting
  server.setRequestHandler(GetPromptRequestSchema, handlers.getPrompt);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  return server;
}
