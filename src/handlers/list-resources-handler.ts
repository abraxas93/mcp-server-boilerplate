import {
  ListResourcesRequest,
  Resource,
} from '@modelcontextprotocol/sdk/types.js';

export async function handleListResources(
  _request: ListResourcesRequest,
): Promise<{ resources: Resource[] }> {
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
}
