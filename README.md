# NestJS Microservices

A microservices architecture built with [NestJS](https://nestjs.com/) featuring multiple services communicating via TCP and RabbitMQ.

## Architecture

```
┌─────────────────┐
│     Gateway     │ ← HTTP API (Port 3000)
│   (REST API)    │
└────────┬────────┘
         │
    ┌────┴────┬─────────────┐
    │         │             │
    ▼         ▼             ▼
┌───────┐ ┌───────┐   ┌─────────┐
│Catalog│ │ Media │   │ Search  │
│ (RMQ) │ │ (TCP) │   │  (TCP)  │
└───────┘ └───────┘   └─────────┘
```

### Services

| Service | Transport | Default Port | Description |
|---------|-----------|--------------|-------------|
| Gateway | HTTP | 3000 | REST API entry point |
| Catalog | RabbitMQ | - | Product catalog service |
| Media | TCP | 4012 | Media handling service |
| Search | TCP | 4013 | Search functionality |

## Prerequisites

- Node.js (v18+)
- RabbitMQ (for Catalog service)

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Gateway
PORT=3000

# Catalog Service (RabbitMQ)
RABBITMQ_URL=amqp://localhost:5672
CATALOG_QUEUE=catalog_queue

# Media Service (TCP)
MEDIA_TCP_PORT=4012

# Search Service (TCP)
SEARCH_TCP_PORT=4013
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

### Production Mode

```bash
# Build all services
npm run build

# Start individual services
npm run start:prod gateway
npm run start:prod catalog
npm run start:prod media
npm run start:prod search
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
nestjs-microservices/
├── apps/
│   ├── gateway/          # HTTP API Gateway
│   ├── catalog/          # Catalog microservice (RabbitMQ)
│   ├── media/            # Media microservice (TCP)
│   └── search/           # Search microservice (TCP)
├── libs/                 # Shared libraries
└── package.json
```

## License

MIT
