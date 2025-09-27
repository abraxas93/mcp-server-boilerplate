import {
  ReadResourceRequest,
  Resource,
} from '@modelcontextprotocol/sdk/types.js';

export async function handleReadResource(
  request: ReadResourceRequest,
): Promise<{ contents: Resource[] }> {
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
}
