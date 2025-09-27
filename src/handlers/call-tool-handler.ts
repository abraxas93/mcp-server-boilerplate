import {
  CallToolRequest,
  CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import { IContainer } from '../container/index.js';
import echo from '../tools/echo.js';
import addTwoNumbers from '../tools/add-two-numbers.js';
import getTime from '../tools/get-time.js';

export async function handleToolCall(
  this: IContainer,
  request: CallToolRequest,
): Promise<CallToolResult> {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'echo':
      return echo.call(this, args);

    case 'add':
      return addTwoNumbers.call(this, args);

    case 'get_time':
      return getTime.call(this, args);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
