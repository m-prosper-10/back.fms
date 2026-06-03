# Developer Setup & Playbook

Project: **fms_backend**
Stack: **node-ts-express**
Profile: **production**

## Setup Commands

- npm install

## Development / Execution

- npm run dev

## Verification

- npm test

## Project Inventory

- `src/app.ts` wires middleware and API routes.
- `src/server.ts` boots the application.
- `src/controllers/` owns response-facing request handlers.
- `src/services/` owns business logic.
- `src/config/` holds environment and data-store configuration.

## Change Protocol

- Before adding a new file, confirm that an existing file is not already responsible.
- When behavior changes, update tests or sample verification in the same change.
- Do not introduce new dependencies without checking existing tools first.
- When changing API behavior, keep route, controller, service, validation, and response shape aligned.
- When changing auth or database behavior, update env examples and configuration files together.

## Selected Scaffold Choices

- Project profile: production
- App type: backend
- Stack: node-ts-express
- Databases: mongodb, redis
- Security preset: bcrypt-jwt
- Logging: morgan
- Monitoring: prometheus-ready
- Testing: jest