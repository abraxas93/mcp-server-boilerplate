import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IMathService, IErrorService } from '../services';

export const addTwoNumbersInputSchema = z.object({
  a: z.number().describe('First number'),
  b: z.number().describe('Second number'),
});

export type AddTwoNumbersParams = z.infer<typeof addTwoNumbersInputSchema>;

export const ADD_TWO_NUMBERS_TOOL: Tool = {
  name: 'add',
  description: 'Add two numbers together',
  inputSchema: zodToJsonSchema(addTwoNumbersInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default function addTwoNumbers(
  this: { mathService: IMathService; errorService: IErrorService },
  params: AddTwoNumbersParams,
): CallToolResult {
  try {
    addTwoNumbersInputSchema.parse(params);
    const result = this.mathService.add(params.a, params.b);
    return {
      content: [
        {
          type: 'text',
          text: `${params.a} + ${params.b} = ${result}`,
        },
      ],
    };
  } catch (error) {
    return this.errorService.handleError(error, {
      operation: 'addTwoNumbers',
      params: { a: params.a, b: params.b },
      timestamp: new Date().toISOString(),
    });
  }
}
