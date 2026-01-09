# NestJS Microservices

A microservices architecture built with [NestJS](https://nestjs.com/) featuring multiple services communicating via RabbitMQ, with Clerk authentication and MongoDB.

## Architecture

```
                    ┌─────────────────┐
                    │     Gateway     │ ← HTTP API (Port 3000)
                    │   (REST API)    │
                    │  + Clerk Auth   │
                    │  + MongoDB      │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
    ┌───────────┐     ┌───────────┐     ┌───────────┐
    │  Catalog  │     │   Media   │     │  Search   │
    │   (RMQ)   │     │   (RMQ)   │     │   (RMQ)   │
    └───────────┘     └───────────┘     └───────────┘
```

### Services

| Service | Transport | Description |
|---------|-----------|-------------|
| Gateway | HTTP | REST API entry point with auth |
| Catalog | RabbitMQ | Product catalog service |
| Media | RabbitMQ | Media handling service |
| Search | RabbitMQ | Search functionality |

## Features

- **Authentication**: Clerk JWT authentication
- **Authorization**: Role-based access control (user/admin)
- **Database**: MongoDB with Mongoose
- **Microservices**: RabbitMQ message broker

## Prerequisites

- Node.js (v18+)
- RabbitMQ
- MongoDB

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Gateway
GATEWAY_PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nestjs-microservices

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# Queues
CATALOG_QUEUE=catalog_queue
MEDIA_QUEUE=media_queue
SEARCH_QUEUE=search_queue
```

## Running the Services

### Start All Services (Development)

```bash
# Terminal 1 - Gateway
npx nest start gateway --watch

# Terminal 2 - Catalog
npx nest start catalog --watch

# Terminal 3 - Media
npx nest start media --watch

# Terminal 4 - Search
npx nest start search --watch
```

## Authentication

### Protected Routes
All routes require JWT authentication by default.

### Public Routes
Use the `@Public()` decorator:
```typescript
@Get('health')
@Public()
health() { }
```

### Admin Only Routes
Use the `@AdminOnly()` decorator:
```typescript
@Delete(':id')
@AdminOnly()
delete() { }
```

### Access Current User
Use the `@CurrentUser()` decorator:
```typescript
@Get('profile')
getProfile(@CurrentUser() user: UserContext) {
  return user;
}
```

## Project Structure

```
nestjs-microservices/
├── apps/
│   ├── gateway/
│   │   └── src/
│   │       ├── auth/           # Authentication (Clerk)
│   │       │   ├── auth.service.ts
│   │       │   ├── jwt-auth-guard.ts
│   │       │   ├── public.decorator.ts
│   │       │   ├── admin.decorator.ts
│   │       │   └── current-user.decorator.ts
│   │       └── users/          # User management
│   │           ├── user.schema.ts
│   │           ├── user.services.ts
│   │           └── user.module.ts
│   ├── catalog/                # Catalog microservice
│   ├── media/                  # Media microservice
│   └── search/                 # Search microservice
├── libs/                       # Shared libraries
└── package.json
```

## API Endpoints

### Health Check
```
GET /health - Check all services status (Public)
```

## License

MIT
