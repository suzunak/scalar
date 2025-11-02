import { describe, expect, it } from 'vitest'

import { sortSchemaProperties } from './sort-schema-properties'

describe('sortSchemaProperties', () => {
  const propertyKeys = ['zebra', 'beta', 'alpha', 'gamma']
  const requiredProperties = ['gamma', 'zebra']

  describe('Case 1: alpha + orderRequiredPropertiesFirst (default)', () => {
    it('sorts required properties alphabetically first, then optional properties alphabetically', () => {
      const result = sortSchemaProperties(propertyKeys, requiredProperties, {
        orderSchemaPropertiesBy: 'alpha',
        orderRequiredPropertiesFirst: true,
      })

      expect(result).toEqual(['gamma', 'zebra', 'alpha', 'beta'])
    })

    it('handles empty required properties', () => {
      const result = sortSchemaProperties(propertyKeys, [], {
        orderSchemaPropertiesBy: 'alpha',
        orderRequiredPropertiesFirst: true,
      })

      expect(result).toEqual(['alpha', 'beta', 'gamma', 'zebra'])
    })

    it('handles all properties being required', () => {
      const result = sortSchemaProperties(propertyKeys, propertyKeys, {
        orderSchemaPropertiesBy: 'alpha',
        orderRequiredPropertiesFirst: true,
      })

      expect(result).toEqual(['alpha', 'beta', 'gamma', 'zebra'])
    })
  })

  describe('Case 2: alpha + !orderRequiredPropertiesFirst', () => {
    it('sorts all properties alphabetically regardless of required status', () => {
      const result = sortSchemaProperties(propertyKeys, requiredProperties, {
        orderSchemaPropertiesBy: 'alpha',
        orderRequiredPropertiesFirst: false,
      })

      expect(result).toEqual(['alpha', 'beta', 'gamma', 'zebra'])
    })
  })

  describe('Case 3: preserve + orderRequiredPropertiesFirst', () => {
    it('preserves order but shows required properties first', () => {
      const result = sortSchemaProperties(propertyKeys, requiredProperties, {
        orderSchemaPropertiesBy: 'preserve',
        orderRequiredPropertiesFirst: true,
      })

      expect(result).toEqual(['zebra', 'gamma', 'beta', 'alpha'])
    })

    it('handles empty required properties', () => {
      const result = sortSchemaProperties(propertyKeys, [], {
        orderSchemaPropertiesBy: 'preserve',
        orderRequiredPropertiesFirst: true,
      })

      expect(result).toEqual(['zebra', 'beta', 'alpha', 'gamma'])
    })
  })

  describe('Case 4: preserve + !orderRequiredPropertiesFirst', () => {
    it('preserves original order for all properties', () => {
      const result = sortSchemaProperties(propertyKeys, requiredProperties, {
        orderSchemaPropertiesBy: 'preserve',
        orderRequiredPropertiesFirst: false,
      })

      expect(result).toEqual(['zebra', 'beta', 'alpha', 'gamma'])
    })
  })

  describe('Edge cases', () => {
    it('handles empty property keys', () => {
      const result = sortSchemaProperties([], requiredProperties, {
        orderSchemaPropertiesBy: 'alpha',
        orderRequiredPropertiesFirst: true,
      })

      expect(result).toEqual([])
    })

    it('handles single property', () => {
      const result = sortSchemaProperties(['single'], ['single'], {
        orderSchemaPropertiesBy: 'alpha',
        orderRequiredPropertiesFirst: true,
      })

      expect(result).toEqual(['single'])
    })

    it('does not mutate original array', () => {
      const original = ['zebra', 'beta', 'alpha', 'gamma']
      sortSchemaProperties(original, requiredProperties, {
        orderSchemaPropertiesBy: 'alpha',
        orderRequiredPropertiesFirst: true,
      })

      expect(original).toEqual(['zebra', 'beta', 'alpha', 'gamma'])
    })

    it('handles properties with special characters', () => {
      const specialProps = ['_private', 'public', '$special', 'normal']
      const result = sortSchemaProperties(specialProps, ['$special'], {
        orderSchemaPropertiesBy: 'alpha',
        orderRequiredPropertiesFirst: true,
      })

      expect(result).toEqual(['$special', '_private', 'normal', 'public'])
    })

    it('handles case-sensitive sorting', () => {
      const caseProps = ['Zebra', 'apple', 'Banana', 'cherry']
      const result = sortSchemaProperties(caseProps, [], {
        orderSchemaPropertiesBy: 'alpha',
        orderRequiredPropertiesFirst: false,
      })

      // localeCompare handles case-insensitive sorting by default
      expect(result).toEqual(['apple', 'Banana', 'cherry', 'Zebra'])
    })
  })
})
