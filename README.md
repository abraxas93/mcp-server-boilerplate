# TypeScript Backend Template

## 🚀 Overview

Enterprise-grade TypeScript backend template built with Clean Architecture principles. This template provides a solid foundation for building scalable microservices and APIs with modern tooling and best practices.

## ✨ Features

- 🏗️ **Clean Architecture** - Domain, Application, and Infrastructure layers
- ⚡ **Fastify** - High-performance web framework
- 🗄️ **MongoDB** - NoSQL database with connection health monitoring
- 🔧 **TypeScript** - Type-safe development with latest ES features
- 🧪 **Jest** - Comprehensive testing framework with 10+ tests
- 📝 **Winston** - Structured logging with multiple transports
- 💉 **TSyringe** - Dependency injection container
- 🐳 **Docker** - Container support for deployment
- 🔍 **ESLint + Prettier** - Code quality and formatting
- 🌍 **Multi-environment** - Development, staging, production configs
- 📋 **Task Runner** - Custom task execution system

## 🛠️ Technology Stack

- **Runtime**: Node.js >= 22.0.0 LTS
- **Language**: TypeScript 5.x
- **Framework**: Fastify 5.x
- **Database**: MongoDB 8.x
- **Testing**: Jest 29.x
- **DI Container**: TSyringe 4.x
- **Logging**: Winston 3.x
- **Linting**: ESLint 8.x + Prettier 3.x

## 🚦 Quick Start

### Prerequisites

- Node.js >= 22.0.0
- MongoDB instance (local or cloud)
- Git

### Installation

```bash
# Clone the template
git clone <your-repo-url>
cd typescript-backend-template

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update environment variables
# Edit .env with your MongoDB connection and other settings

# Start development server
npm run dev
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=dev
SERVER_PORT=3000
SERVER_HOST=0.0.0.0
CORS_ORIGIN=http://localhost:3000

# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
MONGO_USER=your_username
MONGO_PASSWORD=your_password
MONGO_DB=your_database
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
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier

# Task Runner
npm run task <task-name>  # Execute custom tasks
npm run task hello        # Example: Hello world task
npm run task health-check # Example: Health check task
```

## 🏗️ Project Structure

```
src/
├── config/               # Environment configurations
├── infrastructure/       # External concerns (DB, web, controllers)
│   ├── adapters/
│   │   └── controllers/  # HTTP controllers
│   ├── db/              # Database connections
│   ├── di/              # Dependency injection setup
│   └── web/             # Web server and routing
├── tasks/               # Custom task scripts
├── utils/               # Utility functions (logger, etc.)
├── __tests__/           # Test files
└── index.ts            # Application entry point
```

## 🔌 API Endpoints

### Health Check
```http
GET /api/v1/health
```

Returns application health status including:
- Server uptime
- Environment information
- Database connection status
- Application version

**Response Example:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "dev",
  "version": "1.0.0",
  "database": {
    "mongodb": "connected"
  }
}
```

## 🧪 Testing

The template includes comprehensive Jest tests:

```bash
# Run all tests
npm test

# Run specific test file
npm test health.test.ts

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**
- ✅ Health Controller tests
- ✅ Database connection tests
- ✅ Route manager tests
- ✅ Error handling tests
- ✅ Logger functionality tests

## 🔧 Task System

Execute custom tasks via the task runner:

```bash
# Available tasks
npm run task hello        # Simple hello world
npm run task health-check # Check application health
npm run task example      # Example task template

# Add new tasks in src/tasks/index.ts
```

## 🐳 Docker Support

```bash
# Build Docker image
docker build -t typescript-backend-template .

# Run container
docker run -p 3000:3000 \
  -e MONGO_URL=mongodb://host.docker.internal:27017 \
  -e MONGO_DB=your_database \
  typescript-backend-template
```

## 🔒 Environment Support

The template supports multiple environments:

- **Development** (`NODE_ENV=dev`) - Debug logging, CORS enabled
- **Staging** (`NODE_ENV=staging`) - Production-like with monitoring
- **Production** (`NODE_ENV=production`) - Optimized, secure headers

## 📝 Logging

Winston-based logging with multiple levels:

```typescript
import { initLogger } from './utils';

const logger = initLogger(__filename);

logger.info('Application started');
logger.error('Something went wrong', { error: errorObject });
logger.debug('Debug information', { data: debugData });
```

**Log Levels:** `error`, `warn`, `info`, `debug`

## 🔧 Customization

### Adding New Controllers

1. Create controller in `src/infrastructure/adapters/controllers/`
2. Register in dependency injection (`src/infrastructure/di/index.ts`)
3. Add routes in `src/infrastructure/web/RouteManager.ts`

### Adding New Tasks

1. Add task function in `src/tasks/index.ts`
2. Register in the `tasks` object
3. Execute with `npm run task <task-name>`

### Database Collections

Add new MongoDB collections by:
1. Creating repository in `src/infrastructure/repositories/`
2. Registering in DI container
3. Injecting into controllers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing code style (ESLint + Prettier)
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is proprietary software owned by CPrime.

## 🆘 Support

For support and questions:
- Check existing documentation
- Review test examples
- Contact the development team

---

**Built with ❤️ by the CPrime Engineering Team**

*Ready to power your next microservice! 🚀*