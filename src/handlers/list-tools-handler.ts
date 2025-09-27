import { ListToolsRequest, Tool } from '@modelcontextprotocol/sdk/types.js';
import { ECHO_TOOL, ADD_TWO_NUMBERS_TOOL, GET_TIME_TOOL } from '../tools';

export async function handleListTools(
  _request: ListToolsRequest,
): Promise<{ tools: Tool[] }> {
  return {
    tools: [ECHO_TOOL, ADD_TWO_NUMBERS_TOOL, GET_TIME_TOOL],
  };
}
