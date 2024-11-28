# Products Microservice

A microservice built with NestJS framework for handling product-related operations.

## Description

This microservice is built using NestJS, a progressive Node.js framework, and includes database integration with Prisma ORM. It's designed to handle product management operations in a microservices architecture.

## Technologies & Dependencies

### Main Dependencies

- **NestJS v10** (`@nestjs/common`, `@nestjs/core`) - Main framework
- **Prisma** (`@prisma/client`) - ORM for database operations
- **Class Validator & Transformer** - For DTO validation and transformation
- **Microservices Support** (`@nestjs/microservices`) - For microservice communication
- **Environment Configuration** (`dotenv`) - For environment variables management
- **Joi** - For schema validation

### Development Dependencies

- **TypeScript** - Programming language
- **ESLint & Prettier** - Code formatting and linting
- **Jest** - Testing framework
- **Prisma CLI** - Database toolkit

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database

This project uses Prisma as ORM. To work with the database:

```bash
# Generate Prisma Client
$ npx prisma generate

# Run migrations
$ npx prisma migrate dev
```

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/       # Business logic
├── dto/            # Data Transfer Objects
├── entities/       # Database entities
├── prisma/         # Database schema and migrations
└── main.ts         # Application entry point
```

## Features

- Product management (CRUD operations)
- Data validation using class-validator
- Database integration with Prisma
- Microservice communication capabilities
- Environment-based configuration
- Comprehensive testing setup

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="your-database-connection-string"
PORT=3000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is [UNLICENSED](LICENSE).
