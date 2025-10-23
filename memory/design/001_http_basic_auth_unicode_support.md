# HTTP Basic Authentication Unicode Support Design Document

## Metadata
- **Status:** Implemented
- **Author(s):** Development Team
- **Reviewers:** 
- **Created:** 2024-12-19
- **Updated:** 2024-12-19
- **Implementation PR(s):** 

## Overview
HTTP Basic Authentication requires encoding credentials in Base64 format. The application previously used JavaScript's native `btoa()` function for this encoding, which has a significant limitation: it only supports Latin1 (ISO-8859-1) characters. When users attempt to authenticate with credentials containing Unicode characters (such as Polish characters like `żółć`, Cyrillic characters, or emoji), the application throws an `InvalidCharacterError` and fails to send the request.

This limitation affects international users who may have passwords or usernames containing non-ASCII characters. Supporting Unicode characters in authentication credentials is essential for providing a truly global, accessible API client that works for users regardless of their language or character set preferences.

## Goals

1. **Primary Goal:** Enable HTTP Basic Authentication to work with Unicode characters in both username and password fields
2. **Secondary Goal:** Maintain backward compatibility with existing authentication functionality
3. **Tertiary Goal:** Ensure consistent Base64 encoding across all authentication-related code paths
4. **Quality Goal:** Add comprehensive test coverage for Unicode character scenarios

## Proposed Solution

### High-Level Approach
Replace all instances of JavaScript's native `btoa()` function with the `js-base64` library's `Base64.encode()` method, which properly handles Unicode characters by first converting them to UTF-8 bytes before Base64 encoding. This approach maintains the same API surface while providing Unicode support.

The `js-base64` library is already included as a dependency and is being used in the main authentication flow (`build-request-security.ts`), but there are still some places using `btoa()` that need to be updated.

### Key Components
- **Authentication Core:** `packages/api-client/src/libs/send-request/build-request-security.ts` - Main authentication logic (already fixed)
- **Secret Masking:** `packages/api-reference/src/v2/blocks/scalar-request-example-block/helpers/get-secrets.ts` - Masks credentials in code examples
- **UI Components:** `packages/api-reference/src/features/example-request/ExampleRequest.vue` - Handles credential masking in UI
- **cURL Parsing:** `packages/api-client/src/libs/parse-curl.ts` - Parses cURL commands with authentication
- **Test Coverage:** Multiple test files need Unicode test cases

### Simple Architecture Diagram
```
User Input (Unicode credentials)
    ↓
Template Variable Replacement
    ↓
Credential Concatenation (username:password)
    ↓
Base64.encode() [js-base64 library]
    ↓
Authorization Header: "Basic <encoded-credentials>"
    ↓
HTTP Request
```

## Design Considerations

### 1. Base64 Encoding Library Choice
**Context:** Need to choose between native `btoa()` and a Unicode-compatible alternative

**Options:**
- **Option A:** Native `btoa()` with manual UTF-8 encoding
  - Pros: No external dependencies, smaller bundle size
  - Cons: Complex implementation, error-prone, requires manual UTF-8 handling
- **Option B:** `js-base64` library (already in use)
  - Pros: Proven Unicode support, consistent API, already included
  - Cons: Slightly larger bundle size
- **Option C:** Custom UTF-8 + Base64 implementation
  - Pros: Full control, optimized for our use case
  - Cons: Maintenance burden, testing complexity

**Recommendation:** Option B - Use `js-base64` library consistently across all authentication code paths

### 2. Error Handling Strategy
**Context:** How to handle encoding failures gracefully

**Options:**
- **Option A:** Silent fallback to placeholder
  - Pros: Never breaks the UI
  - Cons: May hide real issues
- **Option B:** Show user-friendly error message
  - Pros: Clear feedback to users
  - Cons: May interrupt workflow
- **Option C:** Log error and continue with placeholder
  - Pros: Debugging info available, graceful degradation
  - Cons: May not be obvious to users

**Recommendation:** Option C - Log encoding errors and continue with placeholder credentials

### 3. Test Coverage Strategy
**Context:** Ensuring Unicode support works across all scenarios

**Options:**
- **Option A:** Unit tests only
  - Pros: Fast, isolated testing
  - Cons: May miss integration issues
- **Option B:** Unit + Integration tests
  - Pros: Comprehensive coverage
  - Cons: More complex test setup
- **Option C:** Unit + Integration + E2E tests
  - Pros: Full confidence in functionality
  - Cons: Slower test execution

**Recommendation:** Option B - Unit tests for encoding functions + Integration tests for authentication flow

## Lifecycle of Code for Key Use Case

1. **User initiates action:** User enters Unicode credentials (e.g., username: `żółć`, password: `тест`) in Basic Auth form
2. **System validates:** Credentials are validated for required fields
3. **Processing step:** Credentials are concatenated as `username:password` string
4. **Data persistence:** String is encoded using `Base64.encode()` from js-base64 library
5. **Response to user:** Authorization header is generated as `Basic <encoded-credentials>`
6. **Post-processing (if any):** Request is sent with proper authentication header

### Error Scenarios
- **If validation fails:** Show validation error message, prevent request
- **If encoding fails:** Log error, use placeholder credentials, continue with request
- **If request fails:** Show HTTP error response to user

## Detailed Design

### Schema Updates
No database schema changes required - this is a client-side encoding improvement.

### API Endpoints
No API endpoint changes required - this affects how credentials are encoded in the Authorization header, not the API contract.

### UI Changes
- **Authentication Form:** No visual changes to the Basic Auth form
- **Error Handling:** May show encoding errors in console logs
- **Code Examples:** Credentials with Unicode characters will be properly masked in generated code snippets

### Services / Business Logic

#### Authentication Service
```typescript
// Current implementation (already fixed)
import { Base64 } from 'js-base64'

export const buildRequestSecurity = (securitySchemes, env, emptyTokenPlaceholder = '') => {
  // ... existing code ...
  if (scheme.scheme === 'basic') {
    const username = replaceTemplateVariables(scheme.username, env)
    const password = replaceTemplateVariables(scheme.password, env)
    const value = `${username}:${password}`
    
    headers['Authorization'] = `Basic ${value === ':' ? 'username:password' : Base64.encode(value)}`
  }
  // ... rest of implementation
}
```

#### Secret Masking Service
```typescript
// Needs to be updated
import { Base64 } from 'js-base64'

export const getSecrets = (securitySchemes: SecuritySchemeObject[]) =>
  securitySchemes.flatMap((scheme) => {
    if (scheme?.type === 'http') {
      return [
        scheme['x-scalar-secret-token'],
        scheme['x-scalar-secret-username'],
        scheme['x-scalar-secret-password'],
        Base64.encode(`${scheme['x-scalar-secret-username']}:${scheme['x-scalar-secret-password']}`), // Replace btoa()
      ]
    }
    // ... rest of implementation
  })
```

### Data Migration Plan
No data migration required - this is a client-side encoding change.

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Breaking existing authentication | High | Low | Comprehensive testing with existing credentials |
| Bundle size increase | Low | High | js-base64 is already included, minimal impact |
| Performance degradation | Low | Low | Base64 encoding is not performance-critical |
| Unicode encoding inconsistencies | Medium | Medium | Use js-base64 consistently across all code paths |

### Technical Debt
- **Inconsistent encoding:** Some code paths still use `btoa()` - needs to be standardized
- **Test coverage:** Need to add Unicode test cases to existing test suites
- **Documentation:** Update API documentation to reflect Unicode support

## Rollout Plan

### Deployment Strategy
- [x] Feature flag implementation: Not needed - this is a bug fix
- [x] Canary deployment percentage: Not applicable - client-side change
- [x] Full rollout criteria: All tests pass, no regressions detected

### Rollback Plan
If issues arise, revert the changes to use `btoa()` again, but this would reintroduce the Unicode limitation.

### Monitoring & Alerts
- **Key metrics:** Authentication success rate, error logs
- **Alert thresholds:** Increase in authentication failures
- **Dashboards:** Monitor authentication-related errors in production

## Open Questions

1. **Performance Impact:** Should we benchmark the performance difference between `btoa()` and `Base64.encode()`?
2. **Browser Compatibility:** Are there any browser compatibility concerns with the js-base64 library?
3. **Security Considerations:** Are there any security implications of using a third-party Base64 library?

## References
- [Common issue with btoa() - Stack Overflow](https://stackoverflow.com/questions/23223718/failed-to-execute-btoa-on-window-the-string-to-be-encoded-contains-characte)
- [js-base64 library documentation](https://github.com/dankogai/js-base64)
- [RFC 7617 - The 'Basic' HTTP Authentication Scheme](https://tools.ietf.org/html/rfc7617)
- [MDN Web Docs - btoa()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa)
