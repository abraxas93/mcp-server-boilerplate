# MCP Server Boilerplate

## 🚀 Overview

A production-ready TypeScript boilerplate for building Model Context Protocol (MCP) servers. This template provides a solid foundation for creating MCP servers with clean architecture, comprehensive error handling, and extensible tool/resource management.

## ✨ Features

- 🔧 **MCP Protocol Support** - Full MCP server implementation with tools and resources
- ⚡ **TypeScript** - Type-safe development with modern ES features
- 🛠️ **Tool System** - Easy-to-extend tool architecture with Zod validation
- 📁 **Resource Management** - File and configuration resource support
- 🎯 **Clean Architecture** - Dependency injection, handler binding, and service layer separation
- 🚨 **Error Handling** - Comprehensive error management with proper MCP responses
- 🧪 **Testing Ready** - Jest configuration for unit and integration tests
- 🐳 **Docker Support** - Container-ready deployment
- 📝 **Code Quality** - ESLint + Prettier for consistent code style

## 🛠️ Technology Stack

- **Runtime**: Node.js >= 22.0.0
- **Language**: TypeScript 5.x
- **MCP SDK**: @modelcontextprotocol/sdk 1.18.2
- **Validation**: Zod 3.x with JSON Schema generation
- **Testing**: Jest 30.x
- **Linting**: ESLint 8.x + Prettier 3.x
- **Build**: TypeScript compiler with path aliases

## 🚦 Quick Start

### Prerequisites

- Node.js >= 22.0.0
- Git

### Installation

```bash
# Clone the template
git clone <your-repo-url>
cd mcp-server-template

# Install dependencies
npm install

# Build the project
npm run build

# Start the MCP server
npm start
```

### Development Mode

```bash
# Start development server with hot reload
npm run dev
```

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server

# Testing
npm test             # Run Jest test suite
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

## 🏗️ Project Structure

```
src/
├── config/               # Configuration management
├── container/            # Dependency injection container
├── handlers/            # MCP request handlers
│   ├── tool-call-handler.ts    # Tool execution handler
│   ├── tools-handler.ts        # Tool listing handler
│   ├── resources-handler.ts    # Resource listing handler
│   └── read-resource-handler.ts # Resource reading handler
├── services/            # Business logic services
│   ├── MathService.ts   # Mathematical operations
│   └── ErrorService.ts  # Error handling and formatting
├── tools/               # MCP tools implementation
│   ├── echo.ts          # Echo tool
│   ├── add-two-numbers.ts # Math tool
│   └── get-time.ts      # Time tool
├── types/               # TypeScript type definitions
├── index.ts            # Application entry point & handler binding
└── server.ts           # MCP server setup & protocol configuration
```

## 🔧 Available Tools

The boilerplate includes three example tools to demonstrate the architecture:

### 1. Echo Tool

**Name**: `echo`  
**Description**: Echo back the input text  
**Parameters**:

- `text` (string): Text to echo back

**Example Usage**:

```json
{
  "name": "echo",
  "arguments": {
    "text": "Hello, MCP!"
  }
}
```

### 2. Add Two Numbers Tool

**Name**: `add`  
**Description**: Add two numbers together  
**Parameters**:

- `a` (number): First number
- `b` (number): Second number

**Example Usage**:

```json
{
  "name": "add",
  "arguments": {
    "a": 5,
    "b": 3
  }
}
```

### 3. Get Time Tool

**Name**: `get_time`  
**Description**: Get current timestamp  
**Parameters**:

- `random_string` (string, optional): Dummy parameter for no-parameter tools

**Example Usage**:

```json
{
  "name": "get_time",
  "arguments": {
    "random_string": "dummy"
  }
}
```

## 📁 Available Resources

The server provides two example resources:

### 1. Example Text File

**URI**: `file:///example.txt`  
**Type**: `text/plain`  
**Description**: A simple example text resource

### 2. Server Information

**URI**: `config://server-info`  
**Type**: `application/json`  
**Description**: Information about this MCP server including capabilities and available tools

## 🛠️ Adding New Tools

### 1. Create Tool Implementation

Create a new file in `src/tools/`:

```typescript
// src/tools/my-tool.ts
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IErrorService } from '../services';

export const myToolInputSchema = z.object({
  input: z.string().describe('Input parameter'),
});

export type MyToolParams = z.infer<typeof myToolInputSchema>;

export const MY_TOOL: Tool = {
  name: 'my_tool',
  description: 'Description of what this tool does',
  inputSchema: zodToJsonSchema(myToolInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default function myTool(
  this: { errorService: IErrorService },
  params: MyToolParams,
): CallToolResult {
  try {
    // Your tool logic here
    return {
      content: [
        {
          type: 'text',
          text: `Result: ${params.input}`,
        },
      ],
    };
  } catch (error) {
    return this.errorService.handleError(error, {
      operation: 'myTool',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 2. Register Tool

Update `src/tools/index.ts`:

```typescript
export * from './my-tool.js';
```

### 3. Add to Tools Handler

Update `src/handlers/tools-handler.ts`:

```typescript
import { MY_TOOL } from '../tools';

export async function handleListTools(
  _request: ListToolsRequest,
): Promise<{ tools: Tool[] }> {
  return {
    tools: [ECHO_TOOL, ADD_TWO_NUMBERS_TOOL, GET_TIME_TOOL, MY_TOOL],
  };
}
```

### 4. Add to Tool Call Handler

Update `src/handlers/tool-call-handler.ts`:

```typescript
import myTool from '../tools/my-tool.js';

export async function handleToolCall(
  this: IContainer,
  request: CallToolRequest,
): Promise<CallToolResult> {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'my_tool':
      return myTool.call(this, args);
    // ... other cases
  }
}
```

## 📁 Adding New Resources

### 1. Update Resources Handler

Add your resource to `src/handlers/resources-handler.ts`:

```typescript
export async function handleListResources(
  _request: ListResourcesRequest,
): Promise<{ resources: Resource[] }> {
  return {
    resources: [
      // ... existing resources
      {
        uri: 'my-resource://data',
        name: 'My Resource',
        description: 'Description of my resource',
        mimeType: 'application/json',
      },
    ],
  };
}
```

### 2. Update Read Resource Handler

Add handling in `src/handlers/read-resource-handler.ts`:

```typescript
export async function handleReadResource(
  request: ReadResourceRequest,
): Promise<{ contents: Resource[] }> {
  const { uri } = request.params;

  switch (uri) {
    case 'my-resource://data':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({ data: 'your data here' }),
          },
        ],
      };
    // ... other cases
  }
}
```

## 🧪 Testing

The boilerplate includes Jest configuration for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test my-tool.test.ts
```

### Example Test Structure

```typescript
// src/__tests__/tools/echo.test.ts
import echo from '../../tools/echo.js';
import { ErrorService } from '../../services/ErrorService.js';

describe('Echo Tool', () => {
  const mockErrorService = new ErrorService();

  it('should echo back the input text', () => {
    const result = echo.call(
      { errorService: mockErrorService },
      { text: 'Hello, World!' },
    );

    expect(result.content).toEqual([
      { type: 'text', text: 'Echo: Hello, World!' },
    ]);
  });
});
```

## 🐳 Docker Support

### Build Docker Image

```bash
docker build -t mcp-server-template .
```

### Run Container

```bash
docker run -it mcp-server-template
```

### Dockerfile

The included Dockerfile creates an optimized production image:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/index.js"]
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for configuration:

```env
NODE_ENV=production
LOG_LEVEL=info
```

### TypeScript Configuration

The project uses strict TypeScript configuration with:

- ES2022 target
- Node16 module resolution
- Strict type checking
- Source maps for debugging

## 🚨 Error Handling

The boilerplate includes comprehensive error handling:

- **ErrorService**: Centralized error management
- **MCP-compliant responses**: Proper error flags and messages
- **Error categorization**: Different handling for TypeError, RangeError, etc.
- **Context preservation**: Operation context and parameters in error logs

## 🏛️ Architecture Overview

### Handler-Based Architecture

The server uses a clean handler-based architecture with dependency injection:

1. **Application Entry Point** (`index.ts`):
   - Creates dependency injection container
   - Binds handlers with container context
   - Passes bound handlers to server

2. **Server Setup** (`server.ts`):
   - Focuses purely on MCP protocol configuration
   - Accepts pre-bound handlers as constructor parameters
   - No knowledge of handler implementations

3. **Benefits**:
   - **Single Responsibility**: Server only handles MCP protocol
   - **Testability**: Easy to inject mock handlers for testing
   - **Flexibility**: Handler composition at application level
   - **Type Safety**: Full TypeScript support with proper MCP types

### Handler Binding Flow

```typescript
// index.ts - Application wiring
const container = createContainer();
const handlers = {
  toolCall: handleToolCall.bind(container),
  listTools: handleListTools.bind(container),
  // ... other handlers
};
await startServer(handlers);

// server.ts - Protocol setup
export async function startServer(handlers: ServerHandlers) {
  // MCP server configuration only
  server.setRequestHandler(CallToolRequestSchema, handlers.toolCall);
  // ... other request handlers
}
```

## 🔌 MCP Protocol Features

### Supported Capabilities

- ✅ **Tools**: Execute custom functions with parameter validation
- ✅ **Resources**: Read files and configuration data
- ✅ **Stdio Transport**: Standard input/output communication
- ✅ **JSON Schema**: Automatic schema generation from Zod schemas
- ✅ **Type Safety**: Full TypeScript support with MCP SDK types

### Request/Response Flow

1. **List Tools**: Client requests available tools
2. **Call Tool**: Client executes tool with parameters
3. **List Resources**: Client requests available resources
4. **Read Resource**: Client reads resource content

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-tool`)
3. Follow the existing code style (ESLint + Prettier)
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing tool'`)
6. Push to the branch (`git push origin feature/amazing-tool`)
7. Open a Pull Request

### Development Guidelines

- Use TypeScript strict mode
- Follow the existing architecture patterns
- Add comprehensive error handling
- Include unit tests for new tools
- Update documentation for new features

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Check the MCP documentation: https://modelcontextprotocol.io/
- Review the example tools and resources
- Check existing issues and discussions

---

**Built with ❤️ for the MCP Community**

_Ready to power your next MCP server! 🚀_
