import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IErrorService } from '../services';

export const getTimeInputSchema = z.object({
  random_string: z
    .string()
    .optional()
    .describe('Dummy parameter for no-parameter tools'),
});

export type GetTimeParams = z.infer<typeof getTimeInputSchema>;

export const GET_TIME_TOOL: Tool = {
  name: 'get_time',
  description: 'Get current timestamp',
  inputSchema: zodToJsonSchema(getTimeInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default function getTime(
  this: { errorService: IErrorService },
  _params: GetTimeParams,
): CallToolResult {
  try {
    return {
      content: [
        {
          type: 'text',
          text: `Current time: ${new Date().toISOString()}`,
        },
      ],
    };
  } catch (error) {
    return this.errorService.handleError(error, {
      operation: 'getTime',
      params: {},
      timestamp: new Date().toISOString(),
    });
  }
}
