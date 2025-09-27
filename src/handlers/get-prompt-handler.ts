import { GetPromptRequest, Prompt } from '@modelcontextprotocol/sdk/types.js';
import { PROMPTS } from './list-prompts-handler';
import { SYSTEM_INSTRUCTIONS } from '../prompts';

export async function handleGetPrompt(
  request: GetPromptRequest,
): Promise<Prompt> {
  const { name, arguments: _args } = request.params;
  const prompt = PROMPTS[name as keyof typeof PROMPTS];
  if (!prompt) throw new Error(`Prompt not found: ${name}`);

  switch (name) {
    case 'system-instructions': {
      return SYSTEM_INSTRUCTIONS;
    }

    default:
      throw new Error('Prompt implementation not found');
  }
}
