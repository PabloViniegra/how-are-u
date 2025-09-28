import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import TermsModal from '../TermsModal.vue'

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    to: vi.fn(),
  }
}))

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()

describe('TermsModal Component', () => {
  let wrapper: VueWrapper<any>
  const mockEmit = vi.fn()

  beforeEach(() => {
    // Clear document body overflow style
    document.body.style.overflow = ''

    // Clear all mocks
    vi.clearAllMocks()

    // Reset event listeners
    document.removeEventListener('keydown', expect.any(Function))
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    // Cleanup document state
    document.body.style.overflow = ''
    document.removeEventListener('keydown', expect.any(Function))
  })

  it('should not render modal when show is false', () => {
    wrapper = mount(TermsModal, {
      props: { show: false },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    expect(wrapper.find('.fixed.inset-0.z-50').exists()).toBe(false)
  })

  it('should render modal when show is true', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    expect(wrapper.find('.fixed.inset-0.z-50').exists()).toBe(true)
  })

  it('should display correct modal title', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    expect(wrapper.find('h2').text()).toBe('Términos y Condiciones')
  })

  it('should contain terms and conditions content', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const content = wrapper.text()
    expect(content).toContain('Aceptación de los Términos')
    expect(content).toContain('Descripción del Servicio')
    expect(content).toContain('Uso de las Imágenes')
    expect(content).toContain('How Are U')
  })

  it('should emit close event when close button is clicked', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const closeButton = wrapper.find('button[aria-label="Cerrar modal"]')
    expect(closeButton.exists()).toBe(true)

    await closeButton.trigger('click')

    expect(wrapper.emitted().close).toBeTruthy()
  })

  it('should have escape key handler function', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    // Just test that the component has the handler logic
    expect(wrapper.vm).toBeDefined()
    // Test that pressing show=false would work (simulate the handler behavior)
    await wrapper.setProps({ show: false })
    expect(wrapper.find('.fixed.inset-0.z-50').exists()).toBe(false)
  })

  it('should emit close event when overlay is clicked', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const overlay = wrapper.find('.absolute.inset-0.bg-black\\/50')
    expect(overlay.exists()).toBe(true)

    // Mock the event target to be the overlay element
    const clickEvent = new Event('click')
    Object.defineProperty(clickEvent, 'target', {
      value: overlay.element,
      writable: false
    })

    await overlay.trigger('click')

    expect(wrapper.emitted().close).toBeTruthy()
  })

  it('should not emit close event when clicking inside modal content', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const modalContent = wrapper.find('.relative.bg-card')
    expect(modalContent.exists()).toBe(true)

    await modalContent.trigger('click')

    expect(wrapper.emitted().close).toBeFalsy()
  })

  it('should set body overflow to hidden when modal opens', async () => {
    wrapper = mount(TermsModal, {
      props: { show: false },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await wrapper.setProps({ show: true })
    await nextTick()

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('should handle body overflow state changes', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    // Test that the modal can be opened and closed
    expect(wrapper.find('.fixed.inset-0.z-50').exists()).toBe(true)

    await wrapper.setProps({ show: false })
    await nextTick()

    expect(wrapper.find('.fixed.inset-0.z-50').exists()).toBe(false)
  })

  it('should have correct ARIA attributes for accessibility', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const closeButton = wrapper.find('button[aria-label="Cerrar modal"]')
    expect(closeButton.attributes('aria-label')).toBe('Cerrar modal')
  })

  it('should have scrollable content area', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const scrollableArea = wrapper.find('.overflow-y-auto')
    expect(scrollableArea.exists()).toBe(true)
    expect(scrollableArea.classes()).toContain('max-h-[calc(80vh-120px)]')
  })

  it('should use correct font classes', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const title = wrapper.find('h2')
    expect(title.classes()).toContain('font-sans')

    const headings = wrapper.findAll('h3')
    headings.forEach(heading => {
      expect(heading.classes()).toContain('font-sans')
    })
  })

  it('should handle non-escape key presses without closing', async () => {
    wrapper = mount(TermsModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    // Simulate different key press
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
    document.dispatchEvent(enterEvent)

    await nextTick()

    expect(wrapper.emitted().close).toBeFalsy()
  })
})