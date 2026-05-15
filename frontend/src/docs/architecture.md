# Frontend Architecture

- Shared API client in `src/api/httpClient.js`.
- Compatibility wrappers keep existing imports working.
- Auth bootstrap is extracted into `src/hooks/useAuthBootstrap.js`.
- Generic request state is available through `src/redux/slices/requestSlice.js`.
- Token persistence is centralized in `src/utils/storage.js`.
