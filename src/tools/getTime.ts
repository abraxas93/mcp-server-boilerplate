import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export const getTimeInputSchema = z.object({});

export type GetTimeParams = z.infer<typeof getTimeInputSchema>;

export const GET_TIME_TOOL = {
  name: 'get_time',
  description: 'Get current timestamp',
  inputSchema: zodToJsonSchema(getTimeInputSchema),
};

export default function getTime(_params: GetTimeParams): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text: `Current time: ${new Date().toISOString()}`,
      },
    ],
  };
}
