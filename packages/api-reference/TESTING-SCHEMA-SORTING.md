# Manual Testing Guide: Schema Property Sorting

## Setup Complete ✅

The development environment is ready for manual testing of the schema property sorting feature.

## Test Files Created

1. **`issue3openapi.json`** - Test OpenAPI specification with properties in specific order:
   - Original order: `zebra`, `beta`, `alpha`, `gamma`
   - Required properties: `gamma`, `zebra`
   - Optional properties: `alpha`, `beta`

2. **`index.html`** - Updated with 4 test configurations for all sorting combinations

## Running the Tests

### Step 1: Start the Dev Server

The dev server should already be running. If not, run:

```bash
cd packages/api-reference
pnpm dev
```

### Step 2: Open in Browser

Navigate to: **http://localhost:5173** (or the port shown in your terminal)

### Step 3: Test Each Configuration

You'll see 4 different configurations in the document selector. Switch between them to verify the sorting behavior:

#### **Test 1: Alpha + Required First (Default)**
- **Configuration:** `orderSchemaPropertiesBy: 'alpha'`, `orderRequiredPropertiesFirst: true`
- **Expected Order:** `gamma`, `zebra`, `alpha`, `beta`
- **Explanation:** Required properties (gamma, zebra) sorted alphabetically, then optional properties (alpha, beta) sorted alphabetically

#### **Test 2: Alpha + Mixed**
- **Configuration:** `orderSchemaPropertiesBy: 'alpha'`, `orderRequiredPropertiesFirst: false`
- **Expected Order:** `alpha`, `beta`, `gamma`, `zebra`
- **Explanation:** All properties sorted alphabetically together, ignoring required status

#### **Test 3: Preserve + Required First**
- **Configuration:** `orderSchemaPropertiesBy: 'preserve'`, `orderRequiredPropertiesFirst: true`
- **Expected Order:** `zebra`, `gamma`, `beta`, `alpha`
- **Explanation:** Required properties (zebra, gamma) in original order, then optional properties (beta, alpha) in original order

#### **Test 4: Preserve + Mixed**
- **Configuration:** `orderSchemaPropertiesBy: 'preserve'`, `orderRequiredPropertiesFirst: false`
- **Expected Order:** `zebra`, `beta`, `alpha`, `gamma`
- **Explanation:** All properties in their original order from the OpenAPI spec

## What to Verify

For each test configuration, check:

### 1. Request Body Schema
- Navigate to `POST /test` endpoint
- Expand the request body section
- Verify the properties are in the expected order
- Check that required properties are marked with the required indicator

### 2. Response Schema
- Check the 200 response schema
- Verify properties match the expected order

### 3. Models Section
- If models are visible in the sidebar, check the `TestModel` schema
- Verify the property order matches the configuration

### 4. Nested Schemas
- Navigate to `POST /complex-test` endpoint
- Check that nested object properties are also sorted correctly
- Verify the `user` object properties follow the sorting rules

## Visual Verification Checklist

✅ Properties appear in the correct order for each configuration
✅ Required properties are visually distinguished (marked with required indicator)
✅ Sorting is applied consistently across all schemas in the document
✅ Nested object properties are also sorted correctly
✅ Switching between configurations updates the property order immediately
✅ No console errors appear

## Test Results Documentation

### Test 1: Alpha + Required First
- [ ] Request body properties: `gamma`, `zebra`, `alpha`, `beta` ✓
- [ ] Response properties: `gamma`, `zebra`, `alpha`, `beta` ✓
- [ ] Model properties: `gamma`, `zebra`, `alpha`, `beta` ✓

### Test 2: Alpha + Mixed
- [ ] Request body properties: `alpha`, `beta`, `gamma`, `zebra` ✓
- [ ] Response properties: `alpha`, `beta`, `gamma`, `zebra` ✓
- [ ] Model properties: `alpha`, `beta`, `gamma`, `zebra` ✓

### Test 3: Preserve + Required First
- [ ] Request body properties: `zebra`, `gamma`, `beta`, `alpha` ✓
- [ ] Response properties: `zebra`, `gamma`, `beta`, `alpha` ✓
- [ ] Model properties: `zebra`, `gamma`, `beta`, `alpha` ✓

### Test 4: Preserve + Mixed
- [ ] Request body properties: `zebra`, `beta`, `alpha`, `gamma` ✓
- [ ] Response properties: `zebra`, `beta`, `alpha`, `gamma` ✓
- [ ] Model properties: `zebra`, `beta`, `alpha`, `gamma` ✓

## Unit Tests Status

All unit tests passing: ✅

```bash
pnpm test packages/api-reference/src/components/Content/Schema/helpers/sort-schema-properties.test.ts --run
```

**Result:** 12 tests passed (12)
- Case 1: alpha + orderRequiredPropertiesFirst - 3 tests ✓
- Case 2: alpha + !orderRequiredPropertiesFirst - 1 test ✓
- Case 3: preserve + orderRequiredPropertiesFirst - 2 tests ✓
- Case 4: preserve + !orderRequiredPropertiesFirst - 1 test ✓
- Edge cases - 5 tests ✓

## Troubleshooting

### Properties not sorting correctly
1. Check browser console for errors
2. Verify the configuration values in the document selector
3. Try hard refresh (Cmd/Ctrl + Shift + R)

### Configuration not applying
1. Ensure the dev server is running
2. Check that you've selected the correct document from the selector
3. Verify the configuration in `index.html` is correct

### Can't see the test specifications
1. Make sure `issue3openapi.json` is in the `packages/api-reference/` directory
2. Check browser network tab for 404 errors
3. Verify the file is valid JSON

## Next Steps

After manual testing is complete:
1. Document any issues found
2. Test with real-world OpenAPI specifications
3. Verify the feature works across different browsers
4. Consider edge cases with deeply nested schemas

## Files Modified for Testing

- `packages/api-reference/index.html` - Test configurations
- `packages/api-reference/issue3openapi.json` - Test specification
- `packages/api-reference/src/components/Content/Schema/helpers/sort-schema-properties.ts` - Sorting logic
- `packages/api-reference/src/components/Content/Schema/helpers/sort-schema-properties.test.ts` - Unit tests
- `packages/api-reference/src/components/Content/Schema/Schema.vue` - Integration
- `packages/types/src/api-reference/api-reference-configuration.ts` - Configuration schema

