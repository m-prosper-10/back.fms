# Developer Setup & Playbook

Project: **fms_backend**
Stack: **node-ts-express**
Profile: **production**
Architecture: **microservices monorepo**

## Setup Commands

- npm install

## Development / Execution

- npm run dev
- `npm run dev` starts the full local stack against your local MongoDB, seeds dev-only defaults for required secrets and service URLs when `.env` is absent, then launches all services on their ports and waits for health checks.
- Redis is optional during startup; missing Redis does not block the stack from becoming ready.

## Verification

- npm test

## Project Inventory

- `services/api-gateway/src` is the API entry layer and reverse-proxy gateway for all service domains.
- `services/auth-service/src` owns authentication flows and MongoDB session storage.
- `services/user-service/src` owns user management.
- `services/extinguisher-service/src` owns extinguisher inventory and status tracking.
- `services/inspection-service/src` owns inspection scheduling, completion, maintenance logging, and overdue inspection detection.
- `services/reporting-service/src` owns dashboard, inventory, inspection, compliance, maintenance, and export reporting endpoints.
- `services/notification-service/src` owns notification creation, inbox listing, read-state updates, and admin delivery operations.
- `shared/` holds cross-service helpers and middleware.

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
