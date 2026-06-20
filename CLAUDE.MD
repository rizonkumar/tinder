- All implementation must be production-grade and
  aligned with scalable engineering practices for both frontend and backend.
- Follow SOLID principles, clean architecture, and strong separation of concerns.
- Avoid code duplication entirely; prioritize reusability and composability.
- Maintain consistent naming conventions, folder structure, and design patterns across the entire codebase.
- Keep the codebase modular, extensible, and easy to maintain.
- Do not include unnecessary comments in the code.
- Ensure strict type safety, proper error handling, and predictable state management.
- Optimize for performance, readability, and long-term maintainability.

Backend Expectations:

Architecture & Layering:

- Strictly follow the layered architecture: routes → controllers → services → repositories → models.
- Controllers handle only HTTP concerns (
  parse request, call service, send response). No business logic.
- Services contain all business logic. No direct Mongoose/DB calls — delegate to repositories.
- Repositories handle all database interactions. No business logic, no HTTP concerns.
- No layer should reach across or skip a layer beneath it.

DTOs (Data Transfer Objects):

- Every service method must return a DTO, never a raw Mongoose document.
- Define one DTO file per domain (e.g. user-dto.js, auth-dto.js, message-dto.js, match-dto.js).
- DTOs are plain objects that define the exact shape of data exposed by the API — sensitive fields (e.g. password, internal flags) must never appear in a DTO.
- Never use hacks like `user.password = undefined` to strip fields; use a DTO mapper instead.

Validation:

- All input validation must use Joi schemas defined in a dedicated validators/ folder, one file per domain.
- Use a single reusable validate(schema) middleware factory to apply schemas — do not duplicate validation logic per route.
- Validate at the route boundary before the request reaches the controller.
- Joi schemas are the single source of truth for what shape of input is accepted.

Constants & Enums:

- All magic strings and repeated literals (e.g. gender values, swipe actions, roles) must live in a constants/ folder.
- Group constants by domain (e.g. genders.js, swipe-actions.js, http-status.js).
- No raw string literals for domain values anywhere in services, models, or middleware.

Environment & Config:

- Validate all required environment variables at startup using Joi in a config/env.js file.
- Export typed, named config constants from config/env.js — never read process.env directly outside of that file.
- Application must fail fast with a clear error if any required env variable is missing or invalid.

Error Handling:

- Use AppError for all known operational errors with an appropriate HTTP status code.
- The global errorHandler middleware is the single place where errors are serialized to responses.
- Never expose raw database errors
  , stack traces, or internal implementation details to the client in production.
- Use specific, actionable error messages for client errors (4xx) and generic messages for server errors (5xx).

Security:

- Sanitize and validate all inputs at every API boundary before processing.
- Manage all secrets through environment variables; never hardcode credentials or tokens.
- Apply authentication and authorization checks via middleware before any protected route handler runs.
- Follow least-privilege: only expose what is needed; strip sensitive fields via DTOs.

Response Shape:

- All API responses must follow a consistent shape: { success, message, data }.
- Cookie-setting logic and response serialization must remain cleanly separated — do not mix auth cookie logic inside a generic response utility.
- Never return different response shapes for the same endpoint across success and error paths.

Real-time (Socket.io):

- Use consistent, namespaced event names defined in constants (e.g. SOCKET_EVENTS).
- Keep socket handlers thin — delegate to services the same way controllers do.
- Never duplicate business logic between REST controllers and socket handlers.

Observability:

- Use structured logging with enough context to trace a request end-to-end.
- All unhandled errors must be logged with relevant context before responding.
- Error responses should include a consistent error code alongside the message to aid debugging.

UI/UX Expectations:

- Use only Lucide icons throughout the application.
- The UI must feel modern, polished, responsive, and production-ready across all screen sizes.
- Prioritize clean UX with intuitive flows, accessibility, proper spacing, visual hierarchy, and interaction feedback.
- Use icons wherever they improve clarity or usability.
- Maintain design consistency across layouts, components, typography, spacing, and states.

Quality Expectations:

- No temporary fixes, hacks, dead code, or inconsistent patterns.
- Ensure the implementation is deployment-ready and follows best practices throughout the codebase.
- Validate edge cases, loading states, and error states before finalizing any implementation.
- Backend: verify correctness of API contracts, DTOs, data integrity, and failure scenarios.
- Frontend: verify responsiveness, accessibility, and interaction states.
