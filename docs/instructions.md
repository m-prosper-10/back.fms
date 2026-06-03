# Developer Setup & Playbook

Project: **fms_backend**
Stack: **node-ts-express**
Profile: **production**
Architecture: **microservices monorepo**

## Setup Commands

- npm install

## Development / Execution

- npm run dev

## Verification

- npm test

## Project Inventory

- `services/api-gateway/src` is the API entry layer.
- `services/auth-service/src` owns authentication flows and MongoDB session storage.
- `services/user-service/src` owns user management.
- `services/extinguisher-service/src` owns extinguisher inventory and status tracking.
- `services/inspection-service/src` owns inspections and maintenance.
- `services/reporting-service/src` owns reporting endpoints.
- `services/notification-service/src` owns notification endpoints.
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
