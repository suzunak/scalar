/**
 * Configuration options for sorting schema properties
 */
export type PropertySortingConfig = {
  /** How to sort properties: alphabetically or preserve original order */
  orderSchemaPropertiesBy: 'alpha' | 'preserve'
  /** Whether to show required properties first */
  orderRequiredPropertiesFirst: boolean
}

/**
 * Sorts schema property keys based on the provided configuration options.
 *
 * The function handles four different sorting combinations:
 * 1. alpha + requiredFirst: Required properties alphabetically, then optional properties alphabetically
 * 2. alpha + !requiredFirst: All properties sorted alphabetically together
 * 3. preserve + requiredFirst: Required properties in original order, then optional properties in original order
 * 4. preserve + !requiredFirst: All properties in their original order (no sorting)
 *
 * @param propertyKeys - Array of property keys to sort
 * @param requiredProperties - Array of property keys that are marked as required
 * @param config - Sorting configuration options
 * @returns Sorted array of property keys
 *
 * @example
 * ```ts
 * const properties = ['zebra', 'beta', 'alpha', 'gamma']
 * const required = ['gamma', 'zebra']
 *
 * // Case 1: alpha + requiredFirst (default)
 * sortSchemaProperties(properties, required, {
 *   orderSchemaPropertiesBy: 'alpha',
 *   orderRequiredPropertiesFirst: true
 * })
 * // Result: ['gamma', 'zebra', 'alpha', 'beta']
 *
 * // Case 2: alpha + !requiredFirst
 * sortSchemaProperties(properties, required, {
 *   orderSchemaPropertiesBy: 'alpha',
 *   orderRequiredPropertiesFirst: false
 * })
 * // Result: ['alpha', 'beta', 'gamma', 'zebra']
 *
 * // Case 3: preserve + requiredFirst
 * sortSchemaProperties(properties, required, {
 *   orderSchemaPropertiesBy: 'preserve',
 *   orderRequiredPropertiesFirst: true
 * })
 * // Result: ['zebra', 'gamma', 'beta', 'alpha']
 *
 * // Case 4: preserve + !requiredFirst
 * sortSchemaProperties(properties, required, {
 *   orderSchemaPropertiesBy: 'preserve',
 *   orderRequiredPropertiesFirst: false
 * })
 * // Result: ['zebra', 'beta', 'alpha', 'gamma']
 * ```
 */
export function sortSchemaProperties(
  propertyKeys: string[],
  requiredProperties: string[] = [],
  config: PropertySortingConfig,
): string[] {
  const { orderSchemaPropertiesBy, orderRequiredPropertiesFirst } = config

  // Case 4: preserve order and do not separate required/optional
  if (orderSchemaPropertiesBy === 'preserve' && !orderRequiredPropertiesFirst) {
    return [...propertyKeys]
  }

  // Case 2: sort alphabetically but do not separate required/optional
  if (orderSchemaPropertiesBy === 'alpha' && !orderRequiredPropertiesFirst) {
    return [...propertyKeys].sort((a, b) => a.localeCompare(b))
  }

  // For the remaining cases, we need to separate required and optional properties
  const requiredSet = new Set(requiredProperties)
  const required = propertyKeys.filter((key) => requiredSet.has(key))
  const optional = propertyKeys.filter((key) => !requiredSet.has(key))

  // Case 3: preserve order but show required first
  if (orderSchemaPropertiesBy === 'preserve' && orderRequiredPropertiesFirst) {
    return [...required, ...optional]
  }

  // Case 1: sort alphabetically and show required first (default behavior)
  const sortedRequired = [...required].sort((a, b) => a.localeCompare(b))
  const sortedOptional = [...optional].sort((a, b) => a.localeCompare(b))
  return [...sortedRequired, ...sortedOptional]
}
