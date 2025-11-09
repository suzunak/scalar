import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import OAuthScopesInput from './OAuthScopesInput.vue'

describe('OAuthScopesInput', () => {
  const createMockFlow = (scopeCount: number, selectedCount: number = 0) => {
    const scopes: Record<string, string> = {}
    for (let i = 1; i <= scopeCount; i++) {
      scopes[`scope${i}`] = `Description for scope ${i}`
    }

    const selectedScopes = Array.from({ length: selectedCount }, (_, i) => `scope${i + 1}`)

    return {
      type: 'authorizationCode' as const,
      scopes,
      selectedScopes,
      authorizationUrl: 'https://auth.example.com/authorize',
      tokenUrl: 'https://auth.example.com/token',
      refreshUrl: 'https://auth.example.com/refresh',
      'x-scalar-client-id': 'client-id',
      'x-scalar-redirect-uri': 'https://callback.example.com',
      'x-usePkce': 'no' as const,
      token: '',
      clientSecret: '',
    }
  }

  const createUpdateScheme = () => vi.fn()

  it('renders the scope count correctly', () => {
    const flow = createMockFlow(10, 3)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    expect(wrapper.text()).toContain('Scopes Selected')
    expect(wrapper.text()).toContain('3 / 10')
  })

  it('displays all scopes when expanded', async () => {
    const flow = createMockFlow(5, 0)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Click to expand
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // Check that all scopes are rendered
    expect(wrapper.text()).toContain('scope1')
    expect(wrapper.text()).toContain('scope2')
    expect(wrapper.text()).toContain('scope3')
    expect(wrapper.text()).toContain('scope4')
    expect(wrapper.text()).toContain('scope5')
  })

  it('does not show "Select All" button when less than 5 scopes are selected', async () => {
    // Only 4 scopes selected - fails condition: selectedScopes.length > 4
    const flow = createMockFlow(10, 4)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Expand the scopes (open = true)
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // "Select All" should NOT be visible because only 4 scopes are selected (needs > 4)
    expect(wrapper.text()).not.toContain('Select All')
  })

  it('does not show "Select All" button when panel is closed even with 5+ scopes selected', async () => {
    // 5 scopes selected but panel is closed - fails condition: open
    const flow = createMockFlow(10, 5)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Don't expand - panel stays closed (open = false)
    // "Select All" should NOT be visible because panel is closed
    expect(wrapper.text()).not.toContain('Select All')
  })

  it('shows "Select All" button when all three conditions are met', async () => {
    // 5 scopes selected - meets condition: selectedScopes.length > 4 (5 > 4) ✓
    // 10 total scopes - meets condition: selectedScopes.length < total (5 < 10) ✓
    const flow = createMockFlow(10, 5)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Expand the scopes - meets condition: open = true ✓
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // "Select All" should be visible (all 3 conditions met)
    expect(wrapper.text()).toContain('Select All')
  })

  it('does not show "Select All" button when all scopes are already selected', async () => {
    // 10 scopes selected out of 10 total - fails condition: selectedScopes.length < total (10 < 10 is false)
    const flow = createMockFlow(10, 10)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Expand the scopes
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // "Select All" should NOT be visible because all scopes are already selected
    expect(wrapper.text()).not.toContain('Select All')
  })

  it('selects all scopes when "Select All" button is clicked', async () => {
    // Create flow with 10 total scopes and 5 already selected
    // This meets the conditions: selectedScopes.length > 4 && selectedScopes.length < total
    const flow = createMockFlow(10, 5)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Initially, "Select All" should not be visible (panel is closed)
    expect(wrapper.text()).not.toContain('Select All')

    // Click disclosure button to expand/open the panel
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // Now "Select All" button should be visible (5 > 4, panel is open, 5 < 10)
    expect(wrapper.text()).toContain('Select All')

    // Find the "Select All" button (it's a ScalarButton component)
    const selectAllButton = wrapper
      .findAllComponents({ name: 'ScalarButton' })
      .find((btn) => btn.text() === 'Select All')
    expect(selectAllButton).toBeDefined()

    // Click the "Select All" button
    await selectAllButton?.trigger('click')
    await nextTick()

    // Verify updateScheme was called with ALL scope keys (all 10)
    expect(updateScheme).toHaveBeenCalledWith('flows.authorizationCode.selectedScopes', [
      'scope1',
      'scope2',
      'scope3',
      'scope4',
      'scope5',
      'scope6',
      'scope7',
      'scope8',
      'scope9',
      'scope10',
    ])
  })

  it('shows "Deselect All" button when all scopes are selected and panel is open', async () => {
    // All 10 scopes selected - meets condition: selectedScopes.length === total (10 === 10) ✓
    const flow = createMockFlow(10, 10)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Expand the scopes - meets condition: open = true ✓
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // "Deselect All" should be visible (all scopes selected and panel open)
    expect(wrapper.text()).toContain('Deselect All')
    // "Select All" should NOT be visible (all scopes already selected)
    expect(wrapper.text()).not.toContain('Select All')
  })

  it('does not show "Deselect All" button when panel is closed even with all scopes selected', async () => {
    // All 10 scopes selected but panel is closed - fails condition: open
    const flow = createMockFlow(10, 10)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Don't expand - panel stays closed (open = false)
    // "Deselect All" should NOT be visible because panel is closed
    expect(wrapper.text()).not.toContain('Deselect All')
  })

  it('does not show "Deselect All" button when not all scopes are selected', async () => {
    // Only 8 out of 10 scopes selected - fails condition: selectedScopes.length === total
    const flow = createMockFlow(10, 8)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Expand the scopes
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // "Deselect All" should NOT be visible because not all scopes are selected
    expect(wrapper.text()).not.toContain('Deselect All')
  })

  it('deselects all scopes when "Deselect All" button is clicked', async () => {
    // Start with all 10 scopes selected
    const flow = createMockFlow(10, 10)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Expand the scopes
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // "Deselect All" button should be visible
    expect(wrapper.text()).toContain('Deselect All')

    // Find the "Deselect All" button (it's a ScalarButton component)
    const deselectAllButton = wrapper
      .findAllComponents({ name: 'ScalarButton' })
      .find((btn) => btn.text() === 'Deselect All')
    expect(deselectAllButton).toBeDefined()

    // Click the "Deselect All" button
    await deselectAllButton?.trigger('click')
    await nextTick()

    // Verify updateScheme was called with empty array (deselect all)
    expect(updateScheme).toHaveBeenCalledWith('flows.authorizationCode.selectedScopes', [])
  })

  it('adds scope to selection when clicking on unselected scope row', async () => {
    const flow = createMockFlow(5, 2)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Expand the scopes
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // Find a scope row that is not selected (scope3)
    const rows = wrapper.findAll('tr')
    const scope3Row = rows.find((row) => row.text().includes('scope3'))
    expect(scope3Row).toBeDefined()

    // Click to select it
    await scope3Row?.trigger('click')
    await nextTick()

    // Verify updateScheme prop was called to add scope3
    expect(updateScheme).toHaveBeenCalledWith('flows.authorizationCode.selectedScopes', ['scope1', 'scope2', 'scope3'])
  })

  it('removes scope from selection when clicking on selected scope row', async () => {
    const flow = createMockFlow(5, 3)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Expand the scopes
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // Find a scope row that is selected (scope2)
    const rows = wrapper.findAll('tr')
    const scope2Row = rows.find((row) => row.text().includes('scope2'))
    expect(scope2Row).toBeDefined()

    // Click to deselect it
    await scope2Row?.trigger('click')
    await nextTick()

    // Verify updateScheme prop was called to remove scope2
    expect(updateScheme).toHaveBeenCalledWith('flows.authorizationCode.selectedScopes', ['scope1', 'scope3'])
  })

  it('handles empty scopes object gracefully', () => {
    const flow = createMockFlow(0, 0)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    expect(wrapper.text()).toContain('Scopes Selected')
    expect(wrapper.text()).toContain('0 / 0')
  })

  it('displays scope descriptions correctly', async () => {
    const flow = createMockFlow(3, 0)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Expand the scopes
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // Check that descriptions are rendered
    expect(wrapper.text()).toContain('Description for scope 1')
    expect(wrapper.text()).toContain('Description for scope 2')
    expect(wrapper.text()).toContain('Description for scope 3')
  })

  it('shows correct visual state for selected scopes', async () => {
    const flow = createMockFlow(5, 2)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Expand the scopes
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // Find checkboxes
    const checkboxes = wrapper.findAll('input[type="checkbox"]')

    // First two scopes should be checked
    expect((checkboxes[0]?.element as HTMLInputElement)?.checked).toBe(true)
    expect((checkboxes[1]?.element as HTMLInputElement)?.checked).toBe(true)

    // Remaining scopes should not be checked
    expect((checkboxes[2]?.element as HTMLInputElement)?.checked).toBe(false)
    expect((checkboxes[3]?.element as HTMLInputElement)?.checked).toBe(false)
    expect((checkboxes[4]?.element as HTMLInputElement)?.checked).toBe(false)
  })

  it('displays chevron icon when collapsed and expanded', async () => {
    const flow = createMockFlow(5, 0)
    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    // Should have an icon (initially collapsed shows ChevronRight)
    const icons = wrapper.findAllComponents({ name: 'ScalarIcon' })
    expect(icons.length).toBeGreaterThan(0)

    // Click to expand
    const disclosureButton = wrapper.find('button')
    await disclosureButton.trigger('click')
    await nextTick()

    // Should still have an icon (expanded shows ChevronDown)
    const iconsAfter = wrapper.findAllComponents({ name: 'ScalarIcon' })
    expect(iconsAfter.length).toBeGreaterThan(0)
  })

  it('works with different OAuth flow types', () => {
    const scopes: Record<string, string> = {
      scope1: 'Description for scope 1',
      scope2: 'Description for scope 2',
      scope3: 'Description for scope 3',
      scope4: 'Description for scope 4',
      scope5: 'Description for scope 5',
    }

    const flow = {
      type: 'clientCredentials' as const,
      scopes,
      selectedScopes: ['scope1', 'scope2'],
      tokenUrl: 'https://auth.example.com/token',
      refreshUrl: 'https://auth.example.com/refresh',
      'x-scalar-client-id': 'client-id',
      token: '',
      clientSecret: '',
    }

    const updateScheme = createUpdateScheme()

    const wrapper = mount(OAuthScopesInput, {
      props: { flow, updateScheme },
    })

    expect(wrapper.text()).toContain('Scopes Selected')
    expect(wrapper.text()).toContain('2 / 5')
  })
})
