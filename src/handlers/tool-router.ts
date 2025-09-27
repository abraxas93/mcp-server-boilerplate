import {
  CallToolRequest,
  CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';

export async function handleToolCall(
  request: CallToolRequest,
): Promise<CallToolResult> {
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
}
