# Scalar Use Cases

## Overview

Scalar is a comprehensive API development toolkit that provides modern, developer-friendly tools for working with APIs and OpenAPI specifications. It serves as a complete alternative to traditional API development tools like Postman, Swagger UI, and various OpenAPI utilities.

---

## Core Use Cases (Ordered by Frequency and Importance)

### 1. Generate Interactive API Documentation

**Who:** Backend developers, API teams, technical writers  
**What:** Transform OpenAPI/Swagger specifications into beautiful, interactive documentation  
**Why:** Replace outdated Swagger UI with modern, developer-friendly API documentation  
**Tools:** `@scalar/api-reference`, framework integrations

**Details:**
- Automatically generate API documentation from OpenAPI 3.1, 3.0, or Swagger 2.0 files
- Provide an integrated API playground for testing endpoints
- Display request/response examples in multiple programming languages
- Customize themes and styling to match brand identity
- Works with plain HTML, or integrates with React, Vue, Next.js, Nuxt, and 20+ frameworks

---

### 2. Test and Debug APIs (API Client)

**Who:** Frontend developers, QA engineers, backend developers  
**What:** Send API requests, inspect responses, and debug API interactions  
**Why:** Need a modern, offline-first alternative to Postman that works with OpenAPI specifications  
**Tools:** `@scalar/api-client`, Scalar Desktop App

**Details:**
- Import OpenAPI specifications to automatically populate available endpoints
- Organize requests into collections
- Manage authentication (Bearer tokens, API keys, OAuth, etc.)
- Handle environment variables and dynamic parameters
- Save request history and share with team members
- Works offline-first with desktop applications (Windows, macOS, Linux)
- Watch mode syncs with your server framework automatically

---

### 3. Parse and Validate OpenAPI Documents

**Who:** API developers, DevOps engineers, CI/CD pipelines  
**What:** Validate OpenAPI specifications, resolve references, and manipulate API definitions  
**Why:** Ensure API specifications are correct before deployment and automate OpenAPI workflows  
**Tools:** `@scalar/openapi-parser`, `@scalar/cli`

**Details:**
- Validate OpenAPI 3.1, 3.0, and Swagger 2.0 documents
- Dereference $ref pointers to resolve all references
- Bundle multiple OpenAPI files into a single document
- Upgrade Swagger 2.0 to OpenAPI 3.1
- Filter and modify OpenAPI documents programmatically
- Sanitize documents to ensure specification compliance
- Track and audit reference resolution

---

### 4. Mock APIs for Development and Testing

**Who:** Frontend developers, QA engineers, integration testers  
**What:** Create realistic mock API servers from OpenAPI specifications  
**Why:** Develop and test frontend code before backend APIs are ready  
**Tools:** `@scalar/mock-server`, `@scalar/cli`

**Details:**
- Generate fully-functional mock endpoints from OpenAPI documents
- Create realistic mock data based on schemas
- Handle authentication and security schemes
- Respond with correct status codes and content types
- Watch mode automatically updates when OpenAPI spec changes
- Perfect for parallel development and integration testing

---

### 5. Integrate API Documentation into Web Applications

**Who:** Full-stack developers, documentation teams  
**What:** Embed API documentation and testing capabilities directly into applications  
**Why:** Provide contextual API documentation within your product or developer portal  
**Tools:** `@scalar/api-reference`, `@scalar/api-client`, framework-specific packages

**Details:**
- Embed via CDN with a simple HTML snippet
- Framework-specific integrations for React, Vue, Next.js, Nuxt, Svelte
- Modal and sidebar modes for compact integration
- Programmatic control over documentation display
- Custom themes and styling
- Works in Docusaurus, Astro, and other documentation frameworks

---

### 6. Generate API Client SDKs and Code Snippets

**Who:** Developer relations teams, SDK maintainers, API consumers  
**What:** Generate client libraries and request examples in multiple programming languages  
**Why:** Make API integration easier for developers using different tech stacks  
**Tools:** `@scalar/snippetz`, integrated into API Reference

**Details:**
- Generate code snippets for 25+ languages and frameworks
- Examples include: JavaScript/TypeScript, Python, PHP, Go, Ruby, Java, C#, Swift, etc.
- Display alongside API documentation
- Customize generation templates
- Include authentication and headers automatically

---

### 7. Enhance Backend Frameworks with Auto-Generated Documentation

**Who:** Backend framework developers, API maintainers  
**What:** Automatically expose API documentation endpoints in web frameworks  
**Why:** Provide instant documentation for APIs built with popular frameworks  
**Tools:** Express, Fastify, NestJS, Hono, Next.js integrations, and 15+ other frameworks

**Details:**
- Add Scalar with 2-3 lines of code
- Automatically serve `/api/reference` or similar documentation endpoint
- Built-in support in ElysiaJS, Litestar, Nitro, Platformatic, and HappyX
- Framework plugins handle OpenAPI spec generation and routing
- Works with .NET, Django, FastAPI, Laravel, Ruby on Rails, and more

---

### 8. Validate and Lint API Specifications in CI/CD

**Who:** DevOps engineers, API governance teams  
**What:** Automate OpenAPI validation and linting in continuous integration pipelines  
**Why:** Catch API specification errors before deployment  
**Tools:** `@scalar/cli`, `@scalar/openapi-parser`

**Details:**
- Validate OpenAPI documents for correctness
- Enforce API design standards and style guides
- Check for breaking changes between versions
- Generate reports for API quality metrics
- Integrate with GitHub Actions, GitLab CI, Jenkins, etc.

---

### 9. Build Developer Portals and API Hubs

**Who:** Enterprise API teams, developer relations  
**What:** Create comprehensive developer portals with documentation, testing, and resources  
**Why:** Provide a centralized hub for API consumers  
**Tools:** Scalar managed hosting, `@scalar/api-reference`, custom integrations

**Details:**
- Host multiple API references in one place
- Free SSL and `*.apidocumentation.com` subdomains
- Markdown documentation alongside API references
- Team collaboration features
- Custom domains (paid)
- Authentication and access control

---

### 10. Convert and Migrate API Specifications

**Who:** API architects, migration teams  
**What:** Convert between different API specification formats and versions  
**Why:** Modernize legacy API specifications or migrate from other tools  
**Tools:** `@scalar/openapi-parser`, `@scalar/postman-to-openapi`

**Details:**
- Upgrade Swagger 2.0 to OpenAPI 3.1
- Convert Postman collections to OpenAPI
- Transform between JSON and YAML formats
- Migrate from Stoplight, API Hub, or other platforms

---

## Typical User Journeys

### Journey 1: Backend Developer Building a New API

**Scenario:** Alex is building a RESTful API with Express.js and wants to provide documentation.

**Steps:**
1. **Add Scalar to Express app** (5 minutes)
   ```bash
   npm install @scalar/express-api-reference
   ```
   Add 3 lines of code to mount documentation at `/api/docs`

2. **Define OpenAPI spec** (ongoing)
   - Write OpenAPI YAML/JSON alongside route definitions
   - Or use JSDoc comments to auto-generate spec

3. **View live documentation** (instant)
   - Navigate to `http://localhost:3000/api/docs`
   - See real-time updates as API changes
   - Test endpoints directly in the browser

4. **Share with frontend team** (1 minute)
   - Send documentation URL
   - Frontend developers can test API immediately
   - No Postman collection exports needed

**Outcome:** Documented API with interactive testing in under 10 minutes

---

### Journey 2: Frontend Developer Working on Features

**Scenario:** Jamie needs to integrate with a backend API that's still in development.

**Steps:**
1. **Get OpenAPI spec** (1 minute)
   - Backend team shares `openapi.yaml` file
   - Or provides documentation URL

2. **Start mock server** (30 seconds)
   ```bash
   npx @scalar/cli mock openapi.yaml --watch
   ```

3. **Develop against mock API** (ongoing)
   - Frontend code works with realistic mock responses
   - No backend dependency blocks progress
   - Mock server updates automatically when spec changes

4. **Switch to real API** (1 minute)
   - Change base URL from `localhost:3000` to production
   - Integration already tested against spec

**Outcome:** Parallel development without backend dependency

---

### Journey 3: QA Engineer Testing API Integration

**Scenario:** Morgan needs to test API endpoints across different environments.

**Steps:**
1. **Download Scalar Desktop App** (2 minutes)
   - Works offline
   - No cloud accounts required

2. **Import OpenAPI specification** (10 seconds)
   - Automatically populates all endpoints
   - Request examples pre-filled

3. **Set up environments** (2 minutes)
   - Create variables for dev, staging, production
   - Store authentication tokens per environment

4. **Create test collection** (10 minutes)
   - Organize requests by feature
   - Save expected responses
   - Document edge cases

5. **Run regression tests** (ongoing)
   - Quickly verify endpoints across environments
   - Export/share collections with team

**Outcome:** Comprehensive API testing workflow without vendor lock-in

---

### Journey 4: API Team Publishing Public Documentation

**Scenario:** Taylor's team needs to publish API docs for external developers.

**Steps:**
1. **Create Scalar account** (2 minutes)
   - Free tier available
   - Get `team-name.apidocumentation.com` subdomain

2. **Upload OpenAPI spec** (1 minute)
   - Web interface or CLI
   - Automatic validation and preview

3. **Customize appearance** (10 minutes)
   - Choose theme
   - Add logo and brand colors
   - Write getting started guide in Markdown

4. **Publish documentation** (instant)
   - Publicly accessible at custom subdomain
   - SSL automatically configured
   - CDN-distributed globally

5. **Keep docs updated** (automated)
   - CI/CD pipeline pushes spec on every release
   - Documentation always in sync with API

**Outcome:** Professional API documentation portal in under 30 minutes

---

### Journey 5: DevOps Engineer Setting Up API Governance

**Scenario:** Sam wants to enforce API standards across 15 microservices.

**Steps:**
1. **Install Scalar CLI in CI pipeline** (5 minutes)
   ```yaml
   # .github/workflows/api-validation.yml
   - name: Validate OpenAPI
     run: npx @scalar/cli validate openapi.yaml
   ```

2. **Define validation rules** (1 hour)
   - Create custom linting rules
   - Enforce naming conventions
   - Check for security schemes
   - Require examples and descriptions

3. **Add to all service repos** (30 minutes)
   - Copy workflow file to each repo
   - Configure branch protection rules
   - Block PRs with invalid specs

4. **Monitor compliance** (ongoing)
   - Dashboard shows validation status
   - Automatic reports on spec quality
   - Track breaking changes

**Outcome:** Automated API governance across all services

---

### Journey 6: Full-Stack Developer Building with Next.js

**Scenario:** Casey is building a Next.js app with API routes and wants instant documentation.

**Steps:**
1. **Install Scalar Next.js package** (1 minute)
   ```bash
   npm install @scalar/nextjs-api-reference
   ```

2. **Create API reference route** (2 minutes)
   ```typescript
   // app/api/reference/route.ts
   import { ApiReference } from '@scalar/nextjs-api-reference'
   export const GET = ApiReference({ /* config */ })
   ```

3. **Generate OpenAPI from API routes** (10 minutes)
   - Use `@scalar/ts-to-openapi` or manual spec
   - Place `openapi.yaml` in project

4. **View documentation** (instant)
   - Navigate to `/api/reference`
   - Documentation updates with API routes
   - Test API calls in the same app

**Outcome:** Self-documenting Next.js API in minutes

---

### Journey 7: Open Source Maintainer Adding API Docs

**Scenario:** River maintains an open-source API library and wants better documentation.

**Steps:**
1. **Add reference docs to README** (5 minutes)
   ```html
   <!-- In README.md or docs site -->
   <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
   ```

2. **Link to OpenAPI spec** (1 minute)
   - Host spec on GitHub or CDN
   - Point Scalar to the URL

3. **Customize for dark mode** (2 minutes)
   - Match project's documentation style
   - Add logo and colors

4. **Deploy with GitHub Pages** (5 minutes)
   - Documentation automatically builds
   - Contributors can view API reference

**Outcome:** Beautiful API docs with zero hosting cost

---

## Advanced Use Cases

### API Schema Registry Management
- Version control for API specifications
- Centralized schema storage
- Collaboration on API designs
- Change tracking and approvals

### Multi-API Documentation Sites
- Combine multiple OpenAPI specs
- Unified navigation across services
- Cross-service search
- Shared authentication examples

### White-Label API Portals
- Custom branding for each client
- Multi-tenant documentation
- Per-client authentication
- Usage analytics and insights

### Automated API Testing
- Generate test suites from OpenAPI specs
- Contract testing between services
- Schema compliance validation
- Regression testing automation

---

## Summary

Scalar provides a complete toolkit for modern API development, covering:

- **Documentation** - Beautiful, interactive API references
- **Testing** - Powerful API client for developers
- **Development** - Mock servers and code generation
- **Governance** - Validation, linting, and standards enforcement
- **Integration** - Works with 20+ frameworks and tools

The platform is designed to replace multiple tools (Postman, Swagger UI, OpenAPI validators, mock servers) with a unified, open-source solution that's developer-friendly and modern.

