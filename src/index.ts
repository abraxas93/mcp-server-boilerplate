#!/usr/bin/env node
import { startServer } from './server.js';
import createContainer from './container/index.js';
import {
  handleToolCall,
  handleListTools,
  handleListResources,
  handleReadResource,
  handleGetPrompt,
  handleListPrompts,
} from './handlers';

// Start the server
async function main(): Promise<void> {
  // Create container instance for DI
  const container = createContainer();

  // Bind handlers with container context
  const handlers = {
    toolCall: handleToolCall.bind(container),
    listTools: handleListTools.bind(container),
    listResources: handleListResources.bind(container),
    readResource: handleReadResource.bind(container),
    getPrompt: handleGetPrompt.bind(container),
    listPrompts: handleListPrompts.bind(container),
  };

  await startServer(handlers);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
