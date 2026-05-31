- All implementation must be production-grade and aligned with scalable engineering practices for both frontend and backend.
- Follow SOLID principles, clean architecture, and strong separation of concerns.
- Avoid code duplication entirely; prioritize reusability and composability.
- Maintain consistent naming conventions, folder structure, and design patterns across the entire codebase.
- Keep the codebase modular, extensible, and easy to maintain.
- Do not include unnecessary comments in the code.
- Ensure strict type safety, proper error handling, and predictable state management.
- Optimize for performance, readability, and long-term maintainability.

Backend Expectations:

- Design RESTful or event-driven APIs with clear contracts, versioning, and consistent error response shapes.
- Enforce input validation, authentication, and authorization at every boundary.
- Use layered architecture (e.g. controllers → services → repositories) with no business logic leaking into transport or persistence layers.
- Handle database interactions safely: use transactions where appropriate, avoid N+1 queries, and never expose raw DB errors to clients.
- Write secure code by default: sanitize inputs, avoid injection vectors, manage secrets via environment variables, and follow least-
privilege principles.
- Ensure observability through structured logging, meaningful error codes, and traceable request flows.

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
- Backend: verify correctness of API contracts, data integrity, and failure scenarios.
- Frontend: verify responsiveness, accessibility, and interaction states.
