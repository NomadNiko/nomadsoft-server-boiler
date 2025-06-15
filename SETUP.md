# NestJS Server Setup Guide

This guide will help you set up this NestJS server project without encountering the common dependency and configuration issues.

## Prerequisites

- Node.js 18.x or 20.x
- npm 9.x or higher
- MongoDB instance (for document database) or PostgreSQL (for relational database)

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

**Note**: The `prepare` script has been configured to skip Husky installation in production environments to prevent setup issues.

### 2. Environment Configuration

Copy the appropriate environment example file:

For MongoDB (Document Database):
```bash
cp env-example-document .env
```

For PostgreSQL (Relational Database):
```bash
cp env-example-relational .env
```

Update the `.env` file with your specific configuration:
- Database connection strings
- JWT secrets
- Email service configuration
- File storage settings (S3, local, etc.)

### 3. Build and Start

```bash
# Build the application
npm run build

# Start in production
npm run start:prod

# Or start in development mode
npm run start:dev
```

## Common Issues Fixed

This setup addresses several common dependency and configuration issues:

### ✅ AWS SDK Dependency Conflicts
- Updated `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` to compatible versions
- Eliminated peer dependency warnings

### ✅ Husky Setup Issues
- Modified `prepare` script to skip Husky in production environments
- Prevents installation failures on servers

### ✅ i18n Directory Missing
- Added automatic copying of i18n files during build process
- Prevents runtime errors related to missing translation files

### ✅ Security Vulnerabilities
- Updated packages to address known security issues
- Reduced vulnerabilities from 9 to 3 (remaining are in Facebook auth dependencies)

### ✅ TypeScript Compilation Issues
- Ensured proper type definitions for username field
- Fixed nullable type conflicts

## Database Setup

### MongoDB (Document Database)
Set `DATABASE_TYPE=mongodb` in your `.env` file and provide a MongoDB connection string.

### PostgreSQL (Relational Database)
Set `DATABASE_TYPE=postgresql` in your `.env` file and provide PostgreSQL connection details.

## Available Scripts

- `npm run build` - Build the application (includes i18n file copying)
- `npm run start:prod` - Start in production mode
- `npm run start:dev` - Start in development mode with hot reload
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## Features Included

- ✅ User authentication with JWT
- ✅ Username field with validation (3-20 chars, alphanumeric + underscore/hyphen)
- ✅ Social authentication (Google, Facebook, Apple)
- ✅ File uploads (S3, local storage)
- ✅ Email service integration
- ✅ Multi-database support (MongoDB/PostgreSQL)
- ✅ Swagger API documentation
- ✅ Rate limiting and security headers
- ✅ Internationalization (i18n)

## Troubleshooting

### Dependency Installation Issues
If you encounter peer dependency warnings, try:
```bash
npm install --legacy-peer-deps
```

### Build Issues
Make sure all TypeScript types are properly defined and run:
```bash
npm run lint
npm run build
```

### Runtime Errors
Check that all environment variables are properly set in your `.env` file and that your database is accessible.

## Production Deployment

For PM2 deployment:
```bash
npm run build
pm2 start ecosystem.config.js
```

Make sure to set up your reverse proxy (nginx) to route requests to the correct port defined in your `.env` file.