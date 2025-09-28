import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '../Footer.vue'
import TermsModal from '../TermsModal.vue'
import PrivacyModal from '../PrivacyModal.vue'

// Mock the modal components
vi.mock('../TermsModal.vue', () => ({
  default: {
    name: 'TermsModal',
    template: '<div data-testid="terms-modal" v-if="show">Terms Modal</div>',
    props: ['show'],
    emits: ['close']
  }
}))

vi.mock('../PrivacyModal.vue', () => ({
  default: {
    name: 'PrivacyModal',
    template: '<div data-testid="privacy-modal" v-if="show">Privacy Modal</div>',
    props: ['show'],
    emits: ['close']
  }
}))

describe('Footer Component', () => {
  it('should render footer with copyright text', () => {
    const wrapper = mount(Footer)

    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('© 2025 How Are U. Todos los derechos reservados.')
  })

  it('should have terms and conditions button', () => {
    const wrapper = mount(Footer)

    const termsButton = wrapper.find('button:first-of-type')
    expect(termsButton.exists()).toBe(true)
    expect(termsButton.text()).toBe('Términos y Condiciones')
  })

  it('should have privacy policy button', () => {
    const wrapper = mount(Footer)

    const privacyButton = wrapper.find('button:last-of-type')
    expect(privacyButton.exists()).toBe(true)
    expect(privacyButton.text()).toBe('Política de Privacidad')
  })

  it('should open terms modal when terms button is clicked', async () => {
    const wrapper = mount(Footer)

    const termsButton = wrapper.find('button:first-of-type')
    await termsButton.trigger('click')

    expect(wrapper.findComponent(TermsModal).props('show')).toBe(true)
  })

  it('should open privacy modal when privacy button is clicked', async () => {
    const wrapper = mount(Footer)

    const privacyButton = wrapper.find('button:last-of-type')
    await privacyButton.trigger('click')

    expect(wrapper.findComponent(PrivacyModal).props('show')).toBe(true)
  })

  it('should close terms modal when close event is emitted', async () => {
    const wrapper = mount(Footer)

    // Open modal first
    const termsButton = wrapper.find('button:first-of-type')
    await termsButton.trigger('click')
    expect(wrapper.findComponent(TermsModal).props('show')).toBe(true)

    // Close modal
    wrapper.findComponent(TermsModal).vm.$emit('close')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(TermsModal).props('show')).toBe(false)
  })

  it('should close privacy modal when close event is emitted', async () => {
    const wrapper = mount(Footer)

    // Open modal first
    const privacyButton = wrapper.find('button:last-of-type')
    await privacyButton.trigger('click')
    expect(wrapper.findComponent(PrivacyModal).props('show')).toBe(true)

    // Close modal
    wrapper.findComponent(PrivacyModal).vm.$emit('close')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(PrivacyModal).props('show')).toBe(false)
  })

  it('should apply correct CSS classes', () => {
    const wrapper = mount(Footer)

    const footer = wrapper.find('footer')
    expect(footer.classes()).toContain('bg-card')
    expect(footer.classes()).toContain('border-t')
    expect(footer.classes()).toContain('border-border')
    expect(footer.classes()).toContain('py-6')
    expect(footer.classes()).toContain('mt-auto')
  })

  it('should have responsive layout classes', () => {
    const wrapper = mount(Footer)

    const flexContainer = wrapper.find('.flex')
    expect(flexContainer.classes()).toContain('flex-col')
    expect(flexContainer.classes()).toContain('sm:flex-row')
    expect(flexContainer.classes()).toContain('items-center')
    expect(flexContainer.classes()).toContain('justify-center')
  })

  it('should have hover effects on buttons', () => {
    const wrapper = mount(Footer)

    const buttons = wrapper.findAll('button')
    buttons.forEach(button => {
      expect(button.classes()).toContain('hover:text-foreground')
      expect(button.classes()).toContain('transition-colors')
      expect(button.classes()).toContain('hover:underline')
    })
  })

  it('should initially have both modals closed', () => {
    const wrapper = mount(Footer)

    expect(wrapper.findComponent(TermsModal).props('show')).toBe(false)
    expect(wrapper.findComponent(PrivacyModal).props('show')).toBe(false)
  })
})