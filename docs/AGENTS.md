# AI Agent Constitution

This project was scaffolded as **Node.js (Express API)**.

## Engineering Identity

Act like:
- Senior Engineer
- Pragmatic Architect
- Fast Implementer

Do not act like:
- Startup influencer
- Dribbble designer
- Framework collector

## Guidance Order

When working in this repository:
1. Follow `.cursorrules` for concise working behavior.
2. Follow this `AGENTS.md` for engineering policy and constraints.
3. Use `docs/instructions.md` for setup, verification, and extension workflow.

## General Principles

Prioritize:
1. Correctness
2. Simplicity
3. Maintainability
4. Speed of implementation

Avoid:
- unnecessary abstractions
- speculative future features
- premature optimization
- overengineering
- architecture inflation

## Architecture

Always follow the existing project architecture.

Do not:
- introduce new patterns
- mix architectural styles
- create unnecessary layers

Before creating a new file:
- check whether an existing file is responsible

Prefer extending existing code over creating new abstractions.

## Dependencies

Do not add dependencies unless requested.

Before recommending a dependency ask:
- Can this be implemented with existing tools?
- Is the dependency solving a real problem?
- Is the dependency already present?

Prefer:
- native APIs
- existing project dependencies

Avoid dependency proliferation.

## File Management

Avoid creating files unnecessarily.

Prefer:
- modifying existing files
- keeping related logic together

Only create a new file when:
- responsibility is clearly separate
- file size becomes unreasonable
- architecture requires separation

## Responses

Be concise.

Do not:
- explain obvious code
- repeat requirements
- output unchanged files

Return:
- changed files
- concise rationale when necessary

## Refactoring

Preserve behavior.

Avoid:
- changing APIs
- changing database schemas
- renaming files

unless explicitly requested.

## Debugging

Identify root cause before proposing fixes.
Do not rewrite large sections of code blindly.
Prefer minimal targeted fixes.

## Current Project Profile

### Production Mode

Priorities:
1. Maintainability
2. Validation
3. Logging
4. Error handling
5. Testing

## Stack-Specific Rules

### Backend Standards

Controllers:
- request parsing
- response handling

Services:
- business logic

Middleware:
- cross-cutting concerns

Validators:
- request validation

Routes:
- endpoint definitions only

### API Design

Use REST conventions.
Use plural resources.
Use consistent naming.

### API Responses

Success shape:
`{ "success": true, "data": ... }`

Failure shape:
`{ "success": false, "message": ... }`

### Error Handling

Never swallow errors.
Return meaningful messages and correct status codes.

### Validation

Validate all external input.
Never trust request body, params, or query values.

### Authentication

Use JWT for protected flows when token auth is selected.
Store passwords using bcrypt or argon2 based on the current scaffold.
Never store plain text passwords.
Never expose password hashes.

### Express Stack Rules

Keep controllers thin and services focused on business logic.
Preserve route versioning and centralized middleware wiring.
Update env setup, config, and tests alongside behavior changes.

### bcrypt Rules

Use bcrypt only for password hashing.
Do not expose password hashes in responses, logs, or serialized payloads.
Keep hashing and verification inside dedicated auth or security boundaries.

### JWT Rules

Keep authentication token handling explicit and centralized.
Validate protected endpoints consistently.
Do not scatter token parsing logic across unrelated modules.

### Redis Rules

Use Redis for clearly scoped caching, queues, sessions, or ephemeral state.
Do not let cache keys or TTL policy become implicit knowledge.
Keep fallback behavior explicit when Redis is unavailable.

## Selected Project Choices

Project profile: production
App type: backend
Stack: node-ts-express
Databases: mongodb, redis
Security preset: bcrypt-jwt
Logging: morgan
Monitoring: prometheus-ready
Testing: jest