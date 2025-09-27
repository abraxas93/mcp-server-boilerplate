interface IServerHandlers {
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

interface IErrorContext {
  operation: string;
  params?: Record<string, unknown>;
  timestamp?: string;
}
