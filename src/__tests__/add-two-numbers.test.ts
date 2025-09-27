import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import addTwoNumbers, {
  addTwoNumbersInputSchema,
  ADD_TWO_NUMBERS_TOOL,
} from '../tools/add-two-numbers';
import { IMathService, IErrorService } from '../services';

// Mock services
const mockMathService: jest.Mocked<IMathService> = {
  add: jest.fn(),
};

const mockErrorService: jest.Mocked<IErrorService> = {
  handleError: jest.fn(),
};

describe('addTwoNumbers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Schema Validation', () => {
    test('addTwoNumbersInputSchema should validate correct inputs', () => {
      const validInputs = [
        { a: 1, b: 2 },
        { a: 0, b: 0 },
        { a: -5, b: 10 },
        { a: 3.14, b: 2.86 },
        { a: Number.MAX_SAFE_INTEGER, b: 1 },
      ];

      validInputs.forEach((input) => {
        expect(() => addTwoNumbersInputSchema.parse(input)).not.toThrow();
      });
    });

    test('addTwoNumbersInputSchema should reject invalid inputs', () => {
      const invalidInputs = [
        { a: '1', b: 2 },
        { a: 1, b: '2' },
        { a: null, b: 2 },
        { a: 1 },
        { b: 2 },
        { a: NaN, b: 2 },
      ];

      invalidInputs.forEach((input) => {
        expect(() => addTwoNumbersInputSchema.parse(input)).toThrow();
      });
    });

    test('addTwoNumbersInputSchema should accept valid inputs with extra properties', () => {
      const validWithExtra = { a: 1, b: 2, c: 3 };
      expect(() =>
        addTwoNumbersInputSchema.parse(validWithExtra),
      ).not.toThrow();
    });

    test('addTwoNumbersInputSchema should accept Infinity values', () => {
      const infinityInputs = [
        { a: Infinity, b: 2 },
        { a: -Infinity, b: 2 },
      ];

      infinityInputs.forEach((input) => {
        expect(() => addTwoNumbersInputSchema.parse(input)).not.toThrow();
      });
    });

    test('ADD_TWO_NUMBERS_TOOL should have correct structure', () => {
      expect(ADD_TWO_NUMBERS_TOOL).toEqual({
        name: 'add',
        description: 'Add two numbers together',
        inputSchema: expect.objectContaining({
          type: 'object',
          properties: {
            a: expect.objectContaining({
              type: 'number',
              description: 'First number',
            }),
            b: expect.objectContaining({
              type: 'number',
              description: 'Second number',
            }),
          },
          required: ['a', 'b'],
        }),
      });
    });
  });

  describe('Happy Path Tests', () => {
    test('should add two positive numbers correctly', () => {
      mockMathService.add.mockReturnValue(3);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 1, b: 2 },
      );

      expect(mockMathService.add).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: '1 + 2 = 3',
          },
        ],
      });
    });

    test('should handle zero values', () => {
      mockMathService.add.mockReturnValue(0);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 0, b: 0 },
      );

      expect(mockMathService.add).toHaveBeenCalledWith(0, 0);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: '0 + 0 = 0',
          },
        ],
      });
    });

    test('should handle negative numbers', () => {
      mockMathService.add.mockReturnValue(-3);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: -5, b: 2 },
      );

      expect(mockMathService.add).toHaveBeenCalledWith(-5, 2);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: '-5 + 2 = -3',
          },
        ],
      });
    });

    test('should handle decimal numbers', () => {
      mockMathService.add.mockReturnValue(6.0);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 3.14, b: 2.86 },
      );

      expect(mockMathService.add).toHaveBeenCalledWith(3.14, 2.86);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: '3.14 + 2.86 = 6',
          },
        ],
      });
    });

    test('should handle large numbers', () => {
      const largeNumber = Number.MAX_SAFE_INTEGER;
      mockMathService.add.mockReturnValue(largeNumber + 1);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: largeNumber, b: 1 },
      );

      expect(mockMathService.add).toHaveBeenCalledWith(largeNumber, 1);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: `${largeNumber} + 1 = ${largeNumber + 1}`,
          },
        ],
      });
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle TypeError from MathService', () => {
      const typeError = new TypeError('Invalid input type');
      mockMathService.add.mockImplementation(() => {
        throw typeError;
      });

      const mockErrorResult: CallToolResult = {
        content: [{ type: 'text', text: 'Invalid input: Invalid input type' }],
        isError: true,
      };
      mockErrorService.handleError.mockReturnValue(mockErrorResult);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 1, b: 2 },
      );

      expect(mockErrorService.handleError).toHaveBeenCalledWith(typeError, {
        operation: 'addTwoNumbers',
        params: { a: 1, b: 2 },
        timestamp: expect.any(String),
      });
      expect(result).toBe(mockErrorResult);
    });

    test('should handle RangeError from MathService', () => {
      const rangeError = new RangeError('Math overflow');
      mockMathService.add.mockImplementation(() => {
        throw rangeError;
      });

      const mockErrorResult: CallToolResult = {
        content: [{ type: 'text', text: 'Math error: Math overflow' }],
        isError: true,
      };
      mockErrorService.handleError.mockReturnValue(mockErrorResult);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: Number.MAX_VALUE, b: Number.MAX_VALUE },
      );

      expect(mockErrorService.handleError).toHaveBeenCalledWith(rangeError, {
        operation: 'addTwoNumbers',
        params: { a: Number.MAX_VALUE, b: Number.MAX_VALUE },
        timestamp: expect.any(String),
      });
      expect(result).toBe(mockErrorResult);
    });

    test('should handle generic errors from MathService', () => {
      const genericError = new Error('Unexpected error');
      mockMathService.add.mockImplementation(() => {
        throw genericError;
      });

      const mockErrorResult: CallToolResult = {
        content: [{ type: 'text', text: 'Operation error: Unexpected error' }],
        isError: true,
      };
      mockErrorService.handleError.mockReturnValue(mockErrorResult);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 1, b: 2 },
      );

      expect(mockErrorService.handleError).toHaveBeenCalledWith(genericError, {
        operation: 'addTwoNumbers',
        params: { a: 1, b: 2 },
        timestamp: expect.any(String),
      });
      expect(result).toBe(mockErrorResult);
    });

    test('should handle non-Error objects thrown by MathService', () => {
      const stringError = 'String error';
      mockMathService.add.mockImplementation(() => {
        throw stringError;
      });

      const mockErrorResult: CallToolResult = {
        content: [{ type: 'text', text: 'Operation error: String error' }],
        isError: true,
      };
      mockErrorService.handleError.mockReturnValue(mockErrorResult);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 1, b: 2 },
      );

      expect(mockErrorService.handleError).toHaveBeenCalledWith(stringError, {
        operation: 'addTwoNumbers',
        params: { a: 1, b: 2 },
        timestamp: expect.any(String),
      });
      expect(result).toBe(mockErrorResult);
    });
  });

  describe('Service Integration Tests', () => {
    test('should call MathService.add with correct parameters', () => {
      mockMathService.add.mockReturnValue(5);

      addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 2, b: 3 },
      );

      expect(mockMathService.add).toHaveBeenCalledTimes(1);
      expect(mockMathService.add).toHaveBeenCalledWith(2, 3);
    });

    test('should not call ErrorService on successful execution', () => {
      mockMathService.add.mockReturnValue(5);

      addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 2, b: 3 },
      );

      expect(mockErrorService.handleError).not.toHaveBeenCalled();
    });

    test('should call ErrorService with correct context on error', () => {
      const error = new Error('Test error');
      mockMathService.add.mockImplementation(() => {
        throw error;
      });

      const mockErrorResult: CallToolResult = {
        content: [{ type: 'text', text: 'Test error' }],
        isError: true,
      };
      mockErrorService.handleError.mockReturnValue(mockErrorResult);

      addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 1, b: 2 },
      );

      expect(mockErrorService.handleError).toHaveBeenCalledTimes(1);
      expect(mockErrorService.handleError).toHaveBeenCalledWith(
        error,
        expect.objectContaining({
          operation: 'addTwoNumbers',
          params: { a: 1, b: 2 },
          timestamp: expect.any(String),
        }),
      );
    });
  });

  describe('Return Format Tests', () => {
    test('should return MCP-compliant CallToolResult on success', () => {
      mockMathService.add.mockReturnValue(7);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 3, b: 4 },
      );

      expect(result).toHaveProperty('content');
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'text',
        text: '3 + 4 = 7',
      });
      expect(result).not.toHaveProperty('isError');
    });

    test('should return MCP-compliant CallToolResult on error', () => {
      const error = new Error('Test error');
      mockMathService.add.mockImplementation(() => {
        throw error;
      });

      const mockErrorResult: CallToolResult = {
        content: [{ type: 'text', text: 'Test error' }],
        isError: true,
      };
      mockErrorService.handleError.mockReturnValue(mockErrorResult);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 1, b: 2 },
      );

      expect(result).toBe(mockErrorResult);
    });
  });

  describe('Edge Cases', () => {
    test('should handle NaN inputs from MathService', () => {
      mockMathService.add.mockReturnValue(NaN);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: 1, b: 2 },
      );

      expect(result.content[0].text).toBe('1 + 2 = NaN');
    });

    test('should handle Infinity results from MathService', () => {
      mockMathService.add.mockReturnValue(Infinity);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: Number.MAX_VALUE, b: Number.MAX_VALUE },
      );

      expect(result.content[0].text).toBe(
        `${Number.MAX_VALUE} + ${Number.MAX_VALUE} = Infinity`,
      );
    });

    test('should handle -Infinity results from MathService', () => {
      mockMathService.add.mockReturnValue(-Infinity);

      const result = addTwoNumbers.call(
        { mathService: mockMathService, errorService: mockErrorService },
        { a: -Number.MAX_VALUE, b: -Number.MAX_VALUE },
      );

      expect(result.content[0].text).toBe(
        `${-Number.MAX_VALUE} + ${-Number.MAX_VALUE} = -Infinity`,
      );
    });
  });

  describe('Context Binding', () => {
    test('should work with proper this context', () => {
      const context = {
        mathService: mockMathService,
        errorService: mockErrorService,
      };
      mockMathService.add.mockReturnValue(10);

      const result = addTwoNumbers.call(context, { a: 5, b: 5 });

      expect(result.content[0].text).toBe('5 + 5 = 10');
    });

    test('should fail gracefully if called without proper context', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (addTwoNumbers as any)({ a: 1, b: 2 });
      }).toThrow();
    });
  });
});
