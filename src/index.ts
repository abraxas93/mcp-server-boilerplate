#!/usr/bin/env node
import { startServer } from './server.js';
import createContainer from './container/index.js';

// Start the server
async function main(): Promise<void> {
  // Create container instance for DI
  const container = createContainer();
  await startServer(container);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
