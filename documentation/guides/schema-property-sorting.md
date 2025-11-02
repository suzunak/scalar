# Schema Property Sorting

This guide explains how to configure the sorting of schema properties in the API reference documentation.

## Overview

The schema property sorting feature allows you to control how properties are displayed in your API documentation through two independent configuration options that work together to control the final display order.

## Configuration Options

### `orderSchemaPropertiesBy`

Controls the sorting method for properties.

- **Type:** `'alpha' | 'preserve'`
- **Default:** `'alpha'`

**Values:**
- `'alpha'`: Sort properties alphabetically
- `'preserve'`: Preserve the original order from the OpenAPI specification

### `orderRequiredPropertiesFirst`

Controls whether required properties are grouped separately from optional properties.

- **Type:** `boolean`
- **Default:** `true`

**Values:**
- `true`: Display required properties first, followed by optional properties
- `false`: Mix required and optional properties together according to the sorting method

## Configuration Combinations

The two options work together to provide four distinct sorting behaviors:

### Case 1: Alphabetical with Required First (Default)

```typescript
{
  orderSchemaPropertiesBy: 'alpha',        // default
  orderRequiredPropertiesFirst: true       // default
}
```

**Behavior:** Required properties sorted alphabetically, then optional properties sorted alphabetically

**Example:**
Given properties: `zebra` (required), `beta` (optional), `alpha` (optional), `gamma` (required)

**Result:** `gamma`, `zebra`, `alpha`, `beta`

---

### Case 2: Alphabetical without Grouping

```typescript
{
  orderSchemaPropertiesBy: 'alpha',
  orderRequiredPropertiesFirst: false
}
```

**Behavior:** All properties sorted alphabetically, regardless of required status

**Example:**
Given properties: `zebra` (required), `beta` (optional), `alpha` (optional), `gamma` (required)

**Result:** `alpha`, `beta`, `gamma`, `zebra`

---

### Case 3: Preserve Order with Required First

```typescript
{
  orderSchemaPropertiesBy: 'preserve',
  orderRequiredPropertiesFirst: true
}
```

**Behavior:** Required properties in original order, then optional properties in original order

**Example:**
Given properties: `zebra` (required), `beta` (optional), `alpha` (optional), `gamma` (required)

**Result:** `zebra`, `gamma`, `beta`, `alpha`

---

### Case 4: Preserve Original Order

```typescript
{
  orderSchemaPropertiesBy: 'preserve',
  orderRequiredPropertiesFirst: false
}
```

**Behavior:** All properties in their original order from the OpenAPI specification

**Example:**
Given properties: `zebra` (required), `beta` (optional), `alpha` (optional), `gamma` (required)

**Result:** `zebra`, `beta`, `alpha`, `gamma`

## Usage Examples

### Basic Setup

```typescript
import { ApiReference } from '@scalar/api-reference'

ApiReference({
  spec: {
    url: 'https://example.com/openapi.json'
  },
  configuration: {
    orderSchemaPropertiesBy: 'alpha',
    orderRequiredPropertiesFirst: true
  }
})
```

### HTML/CDN Setup

```html
<!doctype html>
<html>
  <head>
    <title>API Reference</title>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="https://example.com/openapi.json"
      data-configuration='{
        "orderSchemaPropertiesBy": "preserve",
        "orderRequiredPropertiesFirst": false
      }'>
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>
```

### React Setup

```tsx
import { ApiReferenceReact } from '@scalar/api-reference-react'

function App() {
  return (
    <ApiReferenceReact
      configuration={{
        spec: {
          url: 'https://example.com/openapi.json'
        },
        orderSchemaPropertiesBy: 'preserve',
        orderRequiredPropertiesFirst: true
      }}
    />
  )
}
```

### Vue Setup

```vue
<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference'

const configuration = {
  orderSchemaPropertiesBy: 'alpha',
  orderRequiredPropertiesFirst: false
}
</script>

<template>
  <ApiReference :configuration="configuration" />
</template>
```

### Next.js Setup

```typescript
import { ApiReference } from '@scalar/api-reference'

export default function Page() {
  return (
    <ApiReference
      configuration={{
        spec: {
          url: '/api/openapi.json'
        },
        orderSchemaPropertiesBy: 'preserve',
        orderRequiredPropertiesFirst: false
      }}
    />
  )
}
```

## Use Cases

### Use Case 1: Consistent Alphabetical Order

When you want all properties sorted alphabetically for easy scanning:

```typescript
{
  orderSchemaPropertiesBy: 'alpha',
  orderRequiredPropertiesFirst: false
}
```

**Best for:** APIs with many properties where users need to quickly find specific fields.

---

### Use Case 2: Highlight Required Fields

When you want to emphasize which fields are required:

```typescript
{
  orderSchemaPropertiesBy: 'alpha',
  orderRequiredPropertiesFirst: true  // default
}
```

**Best for:** APIs where it's critical for users to see required fields first before optional ones.

---

### Use Case 3: Match Specification Order

When your OpenAPI spec has a carefully crafted property order you want to maintain:

```typescript
{
  orderSchemaPropertiesBy: 'preserve',
  orderRequiredPropertiesFirst: false
}
```

**Best for:** APIs where the spec author has organized properties in a logical flow (e.g., id, name, description, metadata).

---

### Use Case 4: Specification Order with Required Emphasis

When you want to preserve your spec's order but still highlight required fields:

```typescript
{
  orderSchemaPropertiesBy: 'preserve',
  orderRequiredPropertiesFirst: true
}
```

**Best for:** APIs with well-organized specs where required fields should still be prominent.

## Technical Implementation

The feature is implemented across several files:

### Configuration Schema
**File:** `packages/types/src/api-reference/api-reference-configuration.ts`

Defines the configuration options with proper TypeScript types and Zod validation.

### Sorting Utility
**File:** `packages/api-reference/src/components/Content/Schema/helpers/sort-schema-properties.ts`

Contains the core sorting logic that handles all four configuration combinations.

### Schema Component
**File:** `packages/api-reference/src/components/Content/Schema/Schema.vue`

Integrates the sorting functionality into the schema rendering component.

### Unit Tests
**File:** `packages/api-reference/src/components/Content/Schema/helpers/sort-schema-properties.test.ts`

Comprehensive test coverage for all sorting scenarios and edge cases.

## Migration Guide

### Default Behavior

If you don't specify these configuration options, the default behavior is:
- Properties are sorted alphabetically (`orderSchemaPropertiesBy: 'alpha'`)
- Required properties appear first (`orderRequiredPropertiesFirst: true`)

This provides a consistent, predictable display order across all API references.

### Preserving Legacy Behavior

If you want to maintain the exact order from your OpenAPI specification (matching behavior before this feature):

```typescript
{
  orderSchemaPropertiesBy: 'preserve',
  orderRequiredPropertiesFirst: false
}
```

## FAQ

**Q: Does this affect all schema displays?**  
A: Yes, this configuration applies to request bodies, response schemas, and model definitions throughout the documentation.

**Q: Can I use custom sorting functions?**  
A: Currently, only `'alpha'` and `'preserve'` are supported. Custom sorting functions are not available.

**Q: Does alphabetical sorting consider case sensitivity?**  
A: The alphabetical sorting uses `localeCompare()`, which provides case-insensitive sorting by default.

**Q: What happens to properties with special characters?**  
A: Special characters are sorted according to JavaScript's `localeCompare()` rules. For example: `$special`, `_private`, `normal`, `public`.

**Q: Does this work with discriminator schemas?**  
A: Yes, the sorting applies to all schema properties, including those in discriminator schemas.

**Q: Can I sort differently in different parts of the documentation?**  
A: No, the configuration is global and applies to all schema displays in the reference.

## Related Documentation

- [Configuration](../configuration.md) - Full configuration reference
- [OpenAPI](../openapi.md) - OpenAPI specification support
- [Themes](../themes.md) - Customizing the appearance

## Support

If you encounter any issues with schema property sorting, please:
1. Check that you're using the latest version of `@scalar/api-reference`
2. Verify your configuration syntax matches the examples above
3. Report issues on [GitHub](https://github.com/scalar/scalar/issues)

