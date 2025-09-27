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
  ListPromptsRequest,
  Prompt,
  GetPromptRequest,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
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
  getPrompt: (request: GetPromptRequest) => Promise<Prompt>;
  listPrompts: (request: ListPromptsRequest) => Promise<{ prompts: Prompt[] }>;
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
