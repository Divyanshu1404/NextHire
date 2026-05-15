# NextHire Enterprise Architecture

## Backend
- MVC split: controllers, services, repositories, validators, and middleware.
- Shared utilities: response formatting, operational errors, logging, pagination, and safe query helpers.
- Security: JWT auth, RBAC middleware, request sanitization, and rate limiting.
- Scalability: repository abstraction, queue/event placeholders, and AI module scaffold.

## Data Access
- Mongoose models own schema definition and indexes.
- Repositories own query composition and persistence.
- Services own business rules and orchestration.

## Frontend
- Shared Axios client with request/response interceptors.
- Auth bootstrap lives in a hook instead of `App.jsx`.
- Redux store includes shared request state for future feature slices.
