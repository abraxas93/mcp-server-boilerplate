#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { ADD_TWO_NUMBERS_TOOL } from './tools/addTwoNumbers.js';
import { ECHO_TOOL } from './tools/echo.js';
import { GET_TIME_TOOL } from './tools/getTime.js';

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
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [ECHO_TOOL, ADD_TWO_NUMBERS_TOOL, GET_TIME_TOOL],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'echo':
      // eslint-disable-next-line no-case-declarations
      const echoResult = `Echo: ${args.text}`;
      return {
        content: [
          {
            type: 'text',
            text: echoResult,
          },
        ],
      };

    case 'add':
      // eslint-disable-next-line no-case-declarations
      const result = (args.a as number) + (args.b as number);
      return {
        content: [
          {
            type: 'text',
            text: `${args.a} + ${args.b} = ${result}`,
          },
        ],
      };

    case 'get_time':
      // eslint-disable-next-line no-case-declarations
      const currentTime = new Date().toISOString();
      return {
        content: [
          {
            type: 'text',
            text: `Current time: ${currentTime}`,
          },
        ],
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'file:///example.txt',
        name: 'Example Text File',
        description: 'A simple example text resource',
        mimeType: 'text/plain',
      },
      {
        uri: 'config://server-info',
        name: 'Server Information',
        description: 'Information about this MCP server',
        mimeType: 'application/json',
      },
    ],
  };
});

// Handle resource reading
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'file:///example.txt':
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: 'Hello from the MCP server! This is an example text resource.',
          },
        ],
      };

    case 'config://server-info':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                name: 'simple-mcp-server',
                version: '1.0.0',
                capabilities: ['tools', 'resources'],
                tools: [
                  'echo',
                  'add',
                  'get_time',
                  'ssh_docker_logs',
                  'docker_ps',
                ],
                resources: ['file:///example.txt', 'config://server-info'],
              },
              null,
              2,
            ),
          },
        ],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Start the server
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Simple MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
