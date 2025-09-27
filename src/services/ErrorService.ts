import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export interface IErrorService {
  handleError(error: unknown, context: IErrorContext): CallToolResult;
}

export class ErrorService implements IErrorService {
  handleError(error: unknown, context: IErrorContext): CallToolResult {
    const timestamp = context.timestamp || new Date().toISOString();

    // Log internal errors to stderr for debugging/monitoring
    console.error(`[${context.operation}] Internal error:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      params: context.params,
      timestamp,
    });

    // Proper MCP error handling with isError flag
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Categorize different error types
    if (error instanceof TypeError) {
      return {
        content: [{ type: 'text', text: `Invalid input: ${errorMessage}` }],
        isError: true,
      };
    }

    if (error instanceof RangeError) {
      return {
        content: [{ type: 'text', text: `Math error: ${errorMessage}` }],
        isError: true,
      };
    }

    // Generic error fallback
    return {
      content: [{ type: 'text', text: `Operation error: ${errorMessage}` }],
      isError: true,
    };
  }
}
