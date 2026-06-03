# fms_backend

Production baseline General business API

## Scaffold Summary

- App type: Backend
- Stack: Node.js + TypeScript + Express
- API style: REST
- Logging: morgan
- Monitoring: prometheus-ready
- Security preset: bcrypt password hashing + JWT issuance

## Selected Databases

- MongoDB
- Redis

## Setup

```bash
npm install
cp .env.example .env
```

## Development

```bash
npm run dev
```

## Quality Checks

```bash
npm run lint
npm test
npm run build
```

## API Endpoints

- `GET /api/health`
- `GET /api/v1/examples`
- `POST /api/v1/examples/echo`
