import { ListPromptsRequest, Prompt } from '@modelcontextprotocol/sdk/types.js';

export const PROMPTS = {
  'system-instructions': {
    name: 'system-instructions',
    description: 'Plain instructions to be used as a future system prompt',
    arguments: [],
  },
};

export async function handleListPrompts(
  _request: ListPromptsRequest,
): Promise<{ prompts: Prompt[] }> {
  return { prompts: Object.values(PROMPTS) };
}
