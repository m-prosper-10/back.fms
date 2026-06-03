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

`auth-service` also requires `MONGODB_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `PASSWORD_RESET_TOKEN_SECRET`.

## Development

```bash
npm run dev
```

Run a specific service with:

```bash
npm run dev:auth-service
npm run dev:inspection-service
```

## Quality Checks

```bash
npm run lint
npm test
npm run build
```

## API Endpoints

- `services/api-gateway/src` contains the current gateway scaffold.
- `services/auth-service/src` is the first domain service scaffold.
- `services/user-service/src` is the user-management service scaffold.
- `services/extinguisher-service/src` is the inventory service scaffold.
- `services/inspection-service/src` is the inspection and maintenance service scaffold.
- `services/reporting-service/src` is the reporting service scaffold.
- `services/notification-service/src` is the notification service scaffold.

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
