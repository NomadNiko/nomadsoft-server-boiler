# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run start:dev` - Start development server with hot reload
- `npm run start:swc` - Start with SWC compiler for faster builds
- `npm run build` - Build application (includes i18n file copying)
- `npm run start:prod` - Start production server

### Code Quality
- `npm run lint` - Run ESLint (use `--fix` to auto-fix issues)
- `npm run format` - Format code with Prettier
- `npm run typeorm` - Access TypeORM CLI for database operations

### Testing
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:relational:docker` - Run E2E tests with PostgreSQL in Docker
- `npm run test:e2e:document:docker` - Run E2E tests with MongoDB in Docker

### Database Operations
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm run seed:run:relational` - Run seeds for PostgreSQL
- `npm run seed:run:document` - Run seeds for MongoDB

### Code Generation
- `npm run generate:resource:relational` - Generate new resource for PostgreSQL
- `npm run generate:resource:document` - Generate new resource for MongoDB
- `npm run generate:resource:all-db` - Generate resource for both databases

## Architecture Overview

This is a NestJS boilerplate implementing **Hexagonal Architecture** (Ports and Adapters pattern) with dual database support.

### Key Architectural Principles

**Database Agnostic Design**: The application supports both MongoDB (document) and PostgreSQL (relational) through adapter pattern. Each feature has separate persistence adapters for both database types.

**Domain-Driven Design**: Business logic is isolated in `domain/` folders, completely independent of infrastructure concerns.

**Hexagonal Structure**: Each module follows this pattern:
```
module/
├── domain/           # Pure business entities
├── dto/             # Data transfer objects
├── infrastructure/
│   └── persistence/
│       ├── document/     # MongoDB adapter
│       ├── relational/   # PostgreSQL adapter
│       └── repository.ts # Port interface
├── controller.ts
├── service.ts
└── module.ts
```

### Core Features Architecture

**Authentication System**: Multi-provider auth (email, Google, Facebook, Apple) with JWT tokens and refresh tokens. Session management supports both database types.

**File Upload System**: Pluggable file storage with adapters for local storage, S3, and S3 presigned URLs. Located in `src/files/infrastructure/uploader/`.

**User Management**: Complete CRUD operations with role-based access control (Admin/User roles). Supports user profiles with optional username field.

**Posts System**: Basic CRUD for posts with comments support, demonstrating the hexagonal pattern implementation.

## Development Workflow

### Database Setup
- Copy `env-example-relational` or `env-example-document` to `.env` based on your database choice
- For PostgreSQL: Run migrations and seeds
- For MongoDB: Seeds will auto-create collections

### Adding New Features
1. Use code generators: `npm run generate:resource:all-db [name]` for dual database support
2. Implement domain entities first (no database dependencies)
3. Create DTOs for API contracts
4. Build service with business logic
5. Add persistence adapters for chosen database(s)
6. Implement controller with proper validation

### Key Files to Understand
- `src/main.ts` - Application bootstrap with global configuration
- `src/app.module.ts` - Root module with database configuration switching
- `src/config/` - Centralized configuration management
- `src/database/` - Database connection and migration setup
- `src/utils/` - Shared utilities including pagination, transformers, and validation

### Environment Variables
The application uses different env files:
- `env-example-relational` - PostgreSQL configuration
- `env-example-document` - MongoDB configuration

Key variables include `DATABASE_TYPE` which switches between `postgresql` and `mongodb`.

### Testing Strategy
- Unit tests for business logic in services
- E2E tests for API endpoints in `test/` directory
- Docker-based E2E tests for database integration
- Separate test databases for isolation

### Code Style
- ESLint + Prettier for consistent formatting
- TypeScript strict mode with decorators
- Conventional commits for commit messages
- Automatic linting post-generation hooks