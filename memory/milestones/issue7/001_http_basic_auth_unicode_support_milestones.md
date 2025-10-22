# HTTP Basic Authentication Unicode Support - Implementation Milestones

**Reference Design:** `memory/design/001_http_basic_auth_unicode_support.md`

## Overview
This document outlines the implementation milestones for supporting Unicode characters in HTTP Basic Authentication. The main authentication flow is already implemented using `js-base64`, but there are still some `btoa()` references that need to be updated for consistency.

## Milestone 1: Verify Current Implementation Status
**Goal:** Confirm what's already working and identify remaining work

### Tasks:
- [ ] Verify that `build-request-security.ts` uses `Base64.encode()` (already implemented)
- [ ] Test manual scenario with Unicode credentials using existing implementation
- [ ] Document current working state and identify remaining `btoa()` references

### Verification:
- [ ] Run `pnpm dev:void-server` and `pnpm dev:client`
- [ ] Configure Basic Auth with Unicode credentials (e.g., username: `żółć`, password: `тест`)
- [ ] Send request and verify it works without `InvalidCharacterError`
- [ ] Check browser console for any encoding errors

### Expected Outcome:
- Basic authentication with Unicode characters works in the main client
- Clear understanding of what still needs to be fixed

---

## Milestone 2: Update Secret Masking in Code Examples
**Goal:** Fix Unicode credential masking in generated code snippets

### Tasks:
- [ ] Update `packages/api-reference/src/v2/blocks/scalar-request-example-block/helpers/get-secrets.ts`
- [ ] Replace `btoa()` with `Base64.encode()` on line 16
- [ ] Add import for `Base64` from `js-base64`

### Verification:
- [ ] Run `pnpm test` for the get-secrets test suite
- [ ] Verify Unicode credentials are properly masked in code examples
- [ ] Test with credentials containing Polish characters (`żółć`) and Cyrillic characters (`тест`)

### Expected Outcome:
- Code examples properly mask Unicode credentials
- No `InvalidCharacterError` when generating code snippets with Unicode credentials

---

## Milestone 3: Update UI Component Credential Masking
**Goal:** Fix Unicode credential masking in the main UI component

### Tasks:
- [ ] Update `packages/api-reference/src/features/example-request/ExampleRequest.vue`
- [ ] Replace `btoa()` with `Base64.encode()` on line 247
- [ ] Add import for `Base64` from `js-base64`

### Verification:
- [ ] Run `pnpm test` for related test suites
- [ ] Verify Unicode credentials are properly masked in the UI
- [ ] Test the example request component with Unicode credentials

### Expected Outcome:
- UI properly masks Unicode credentials in example requests
- No encoding errors in the browser console

---

## Milestone 4: Add Comprehensive Unicode Test Coverage
**Goal:** Ensure all authentication code paths are tested with Unicode characters

### Tasks:
- [ ] Add Unicode test cases to `build-request-security.test.ts`
- [ ] Add Unicode test cases to `get-secrets.test.ts`
- [ ] Verify existing Unicode test in `createVoidServer.test.ts` still passes

### Test Cases to Add:
- [ ] Test with Polish characters: `żółć:тест`
- [ ] Test with Cyrillic characters: `тест:пароль`
- [ ] Test with emoji: `user😀:pass🔒`
- [ ] Test with mixed scripts: `admin:пароль123`

### Verification:
- [ ] Run `pnpm test` and verify all new tests pass
- [ ] Run `pnpm test:coverage` to ensure good coverage
- [ ] Verify no regressions in existing tests

### Expected Outcome:
- Comprehensive test coverage for Unicode authentication scenarios
- All tests pass with Unicode characters

---

## Milestone 5: Final Verification and Documentation
**Goal:** Complete the implementation and document the changes

### Tasks:
- [ ] Verify all authentication-related `btoa()` references have been replaced
- [ ] Run full test suite to ensure no regressions
- [ ] Create manual test scenarios for different Unicode character sets

### Manual Testing Scenarios:
- [ ] **Polish Characters:** username: `żółć`, password: `ąęłńść`
- [ ] **Cyrillic Characters:** username: `тест`, password: `пароль`
- [ ] **Emoji:** username: `user😀`, password: `pass🔒`
- [ ] **Mixed Scripts:** username: `admin`, password: `пароль123`

### Verification:
- [ ] All manual test scenarios work without errors
- [ ] No `InvalidCharacterError` in browser console
- [ ] Authorization headers are properly formatted
- [ ] Code examples properly mask Unicode credentials

### Expected Outcome:
- Complete Unicode support for HTTP Basic Authentication
- All authentication flows work with international characters
- Comprehensive test coverage

---

## Success Criteria
- [ ] No `InvalidCharacterError` when using Unicode credentials
- [ ] All authentication-related code uses consistent Base64 encoding
- [ ] Comprehensive test coverage for Unicode scenarios
- [ ] Manual testing confirms support for major international character sets
- [ ] No regressions in existing authentication functionality

## Notes
- The main authentication flow (`build-request-security.ts`) is already implemented
- Existing Unicode test in `createVoidServer.test.ts` should continue to pass
- Focus only on authentication-related `btoa()` references, not all instances in the codebase
- Use `js-base64` library consistently for all Base64 encoding needs