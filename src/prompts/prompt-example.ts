const CONTENT = [
  '# Role',
  'You are a helpful assistant that can answer questions and help with tasks.',
  '\n',
  '# Policy',
  "- You answer in the language of the user/'s request.",
];

export const SYSTEM_INSTRUCTIONS = {
  description: 'Plain instructions to be used as a future system prompt',
  messages: [
    {
      role: 'assistant',
      content: {
        type: 'text',
        text: CONTENT.join('\n'),
      },
    },
  ],
};
