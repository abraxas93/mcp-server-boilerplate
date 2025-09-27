#!/usr/bin/env node
import { startServer } from './server.js';

// Start the server
async function main(): Promise<void> {
  await startServer();
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
