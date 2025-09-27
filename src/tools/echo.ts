import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';

export const echoInputSchema = z.object({
  text: z.string().describe('Text to echo back'),
});

export type EchoParams = z.infer<typeof echoInputSchema>;

export const ECHO_TOOL: Tool = {
  name: 'echo',
  description: 'Echo back the input text',
  inputSchema: zodToJsonSchema(echoInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default function echo(params: EchoParams): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text: `Echo: ${params.text}`,
      },
    ],
  };
}
