# fms_backend

Production baseline microservices monorepo for a general business backend.

## Scaffold Summary

- App type: Backend
- Stack: Node.js + TypeScript + Express
- API style: REST
- Logging: morgan
- Monitoring: prometheus-ready
- Security preset: bcrypt password hashing + JWT issuance
- Architecture: microservices in a monorepo

## Selected Databases

- MongoDB
- Redis

## Services

- `services/api-gateway` - `4000`
- `services/auth-service` - `4001`
- `services/user-service` - `4002`
- `services/extinguisher-service` - `4003`
- `services/inspection-service` - `4004`
- `services/reporting-service` - `4005`
- `services/notification-service` - `4006`

## Setup

```bash
npm install
cp .env.example .env
```

The root `.env.example` documents the shared defaults and service port map. Override `PORT` and `APP_NAME` per service when running them independently.
For local development, `npm run dev` seeds sane defaults for the required service secrets and service URLs if your `.env` is missing.
MongoDB is expected to be running locally on `mongodb://localhost:27017`.
Redis is optional during development; the stack continues without it.

`auth-service` also requires `MONGODB_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `PASSWORD_RESET_TOKEN_SECRET`.
`inspection-service` requires `MONGODB_URL` and `JWT_ACCESS_SECRET`.
`reporting-service` requires `MONGODB_URL` and `JWT_ACCESS_SECRET`.
`notification-service` requires `MONGODB_URL` and `JWT_ACCESS_SECRET`.

## Development

```bash
npm run dev
```

This single command does the full local startup:
- waits for your local MongoDB instance on `27017`
- starts `api-gateway`, `auth-service`, `user-service`, `extinguisher-service`, `inspection-service`, `reporting-service`, and `notification-service`
- waits for the database ports and service health endpoints to respond before declaring the stack ready
- logs a warning and continues if Redis is not available yet

If you want Redis for future notification/reporting work, run it separately with Docker Compose:

```bash
docker compose up -d redis
```

Run a specific service with:

```bash
npm run dev:auth-service
npm run dev:inspection-service
npm run dev:api-gateway
```

The gateway exposes the backend surface at:
- `/api/auth`
- `/api/users`
- `/api/extinguishers`
- `/api/inspections`
- `/api/maintenance`
- `/api/reports`
- `/api/notifications`

## Quality Checks

```bash
npm run lint
npm test
npm run build
```

## API Endpoints

- `services/api-gateway/src` contains the current gateway scaffold.
- `services/api-gateway/src` is the single frontend-facing entry point and reverse-proxies the service APIs.
- `services/auth-service/src` is the first domain service scaffold.
- `services/user-service/src` is the user-management service scaffold.
- `services/extinguisher-service/src` is the inventory service scaffold.
- `services/inspection-service/src` is the inspection and maintenance service scaffold.
- `services/reporting-service/src` is the reporting and export service.
- `services/notification-service/src` is the notification delivery and in-app inbox service.

### Auth Service

- `GET /api/health`
- `GET /api/auth`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh-token`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/validate-token`

### User Service

- `GET /api/health`
- `GET /api/users/meta`
- `GET /api/users`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `PATCH /api/users/change-password`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/status`

### Extinguisher Service

- `GET /api/health`
- `GET /api/extinguishers/meta`
- `GET /api/extinguishers`
- `GET /api/extinguishers/:id`
- `POST /api/extinguishers`
- `PATCH /api/extinguishers/:id`
- `DELETE /api/extinguishers/:id`
- `GET /api/extinguishers/status/:status`
- `GET /api/extinguishers/location/:location`

### Inspection Service

- `GET /api/health`
- `GET /api/inspections/meta`
- `POST /api/inspections`
- `GET /api/inspections`
- `GET /api/inspections/:id`
- `PATCH /api/inspections/:id`
- `DELETE /api/inspections/:id`
- `PATCH /api/inspections/:id/complete`
- `GET /api/inspections/status/:status`
- `GET /api/inspections/overdue`
- `GET /api/inspections/extinguisher/:extinguisherId`
- `GET /api/maintenance/meta`
- `POST /api/maintenance`
- `GET /api/maintenance`
- `GET /api/maintenance/:id`
- `PATCH /api/maintenance/:id`
- `DELETE /api/maintenance/:id`
- `GET /api/maintenance/extinguisher/:extinguisherId`

### Reporting Service

- `GET /api/health`
- `GET /api/reports/meta`
- `GET /api/reports/dashboard`
- `GET /api/reports/inventory`
- `GET /api/reports/inventory/daily`
- `GET /api/reports/inventory/monthly`
- `GET /api/reports/inventory/yearly`
- `GET /api/reports/inspections`
- `GET /api/reports/inspections/pending`
- `GET /api/reports/inspections/completed`
- `GET /api/reports/inspections/overdue`
- `GET /api/reports/compliance`
- `GET /api/reports/compliance/expired`
- `GET /api/reports/compliance/upcoming-expirations`
- `GET /api/reports/maintenance`
- `GET /api/reports/maintenance/history`
- `GET /api/reports/maintenance/frequency`
- `GET /api/reports/maintenance/recent`
- `GET /api/reports/export/pdf`
- `GET /api/reports/export/csv`

### Notification Service

- `GET /api/health`
- `GET /api/notifications/meta`
- `POST /api/notifications/send`
- `GET /api/notifications`
- `GET /api/notifications/:id`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/:id`
- `DELETE /api/notifications/:id`
- `GET /api/notifications/type/:type`
- `GET /api/notifications/user/:userId`
