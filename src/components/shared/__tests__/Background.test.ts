import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Background from '../Background.vue'

describe('Background Component', () => {
  it('should render the background container', () => {
    const wrapper = mount(Background)

    const container = wrapper.find('.fixed.inset-0.-z-10')
    expect(container.exists()).toBe(true)
  })

  it('should have correct positioning classes', () => {
    const wrapper = mount(Background)

    const container = wrapper.find('div')
    expect(container.classes()).toContain('fixed')
    expect(container.classes()).toContain('inset-0')
    expect(container.classes()).toContain('-z-10')
  })

  it('should have background gradient div', () => {
    const wrapper = mount(Background)

    const gradientDiv = wrapper.find('.absolute.inset-0')
    expect(gradientDiv.exists()).toBe(true)
  })

  it('should have correct gradient background styles', () => {
    const wrapper = mount(Background)

    const gradientDiv = wrapper.find('.absolute.inset-0')
    const style = gradientDiv.attributes('style')

    expect(style).toContain('background-image')
    expect(style).toContain('linear-gradient')
    expect(style).toContain('radial-gradient')
  })

  it('should contain grid pattern gradients', () => {
    const wrapper = mount(Background)

    const gradientDiv = wrapper.find('.absolute.inset-0')
    const style = gradientDiv.attributes('style')

    // Check for grid lines - the template has multiline formatting
    expect(style).toContain('linear-gradient(to right')
    expect(style).toContain('rgba(229, 231, 235, 0.8)')
  })

  it('should contain radial gradient effects', () => {
    const wrapper = mount(Background)

    const gradientDiv = wrapper.find('.absolute.inset-0')
    const style = gradientDiv.attributes('style')

    // Check for radial gradients - with proper spacing
    expect(style).toContain('radial-gradient(circle 500px at 20% 100%')
    expect(style).toContain('radial-gradient(circle 500px at 100% 80%')
    expect(style).toContain('rgba(139, 92, 246, 0.3)')  // Purple gradient
    expect(style).toContain('rgba(59, 130, 246, 0.3)')  // Blue gradient
  })

  it('should have correct background size', () => {
    const wrapper = mount(Background)

    const gradientDiv = wrapper.find('.absolute.inset-0')
    const style = gradientDiv.attributes('style')

    expect(style).toContain('background-size: 48px 48px, 48px 48px, 100% 100%, 100% 100%')
  })

  it('should render as a single div element', () => {
    const wrapper = mount(Background)

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find('div > div').exists()).toBe(true)
  })

  it('should be positioned behind other elements', () => {
    const wrapper = mount(Background)

    const container = wrapper.find('div')
    expect(container.classes()).toContain('-z-10')
  })

  it('should cover the entire viewport', () => {
    const wrapper = mount(Background)

    const container = wrapper.find('.fixed')
    expect(container.classes()).toContain('inset-0')

    const backgroundDiv = wrapper.find('.absolute')
    expect(backgroundDiv.classes()).toContain('inset-0')
  })

  it('should have transparent areas in gradient', () => {
    const wrapper = mount(Background)

    const gradientDiv = wrapper.find('.absolute.inset-0')
    const style = gradientDiv.attributes('style')

    expect(style).toContain('transparent')
  })

  it('should maintain consistent styling structure', () => {
    const wrapper = mount(Background)

    // Outer container
    const outerDiv = wrapper.find('div')
    expect(outerDiv.exists()).toBe(true)

    // Inner gradient div
    const innerDiv = outerDiv.find('.absolute.inset-0')
    expect(innerDiv.exists()).toBe(true)

    // Should only have these two divs
    const allDivs = wrapper.findAll('div')
    expect(allDivs).toHaveLength(2)
  })

  it('should use OKLCH color values', () => {
    const wrapper = mount(Background)

    const gradientDiv = wrapper.find('.absolute.inset-0')
    const style = gradientDiv.attributes('style')

    // Check for the specific RGBA values that correspond to purple and blue (with proper spacing)
    expect(style).toContain('139, 92, 246')  // Purple color
    expect(style).toContain('59, 130, 246')  // Blue color
    expect(style).toContain('229, 231, 235') // Gray grid color
  })

  it('should have multiple background layers', () => {
    const wrapper = mount(Background)

    const gradientDiv = wrapper.find('.absolute.inset-0')
    const backgroundImage = gradientDiv.attributes('style')

    // Should have 4 background layers:
    // 1. Vertical grid lines
    // 2. Horizontal grid lines
    // 3. Purple radial gradient
    // 4. Blue radial gradient
    const gradientCount = (backgroundImage?.match(/gradient/g) || []).length
    expect(gradientCount).toBe(4)
  })

  it('should be a stateless component', () => {
    const wrapper = mount(Background)

    // Component should not have any reactive state
    expect(wrapper.vm.$data).toEqual({})

    // Should not have any props
    expect(Object.keys(wrapper.vm.$props)).toHaveLength(0)
  })
})