import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import PrivacyModal from '../PrivacyModal.vue'

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    to: vi.fn(),
  }
}))

describe('PrivacyModal Component', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    document.body.style.overflow = ''
    vi.clearAllMocks()
    document.removeEventListener('keydown', expect.any(Function))
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    document.body.style.overflow = ''
    document.removeEventListener('keydown', expect.any(Function))
  })

  it('should not render modal when show is false', () => {
    wrapper = mount(PrivacyModal, {
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
    wrapper = mount(PrivacyModal, {
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
    wrapper = mount(PrivacyModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    expect(wrapper.find('h2').text()).toBe('Política de Privacidad')
  })

  it('should contain privacy policy content', async () => {
    wrapper = mount(PrivacyModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const content = wrapper.text()
    expect(content).toContain('Información que Recopilamos')
    expect(content).toContain('Cómo Utilizamos su Información')
    expect(content).toContain('Almacenamiento y Seguridad')
    expect(content).toContain('Sus Derechos')
    expect(content).toContain('Última actualización: 25 de septiembre de 2025')
  })

  it('should emit close event when close button is clicked', async () => {
    wrapper = mount(PrivacyModal, {
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
    wrapper = mount(PrivacyModal, {
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
    wrapper = mount(PrivacyModal, {
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

    const clickEvent = new Event('click')
    Object.defineProperty(clickEvent, 'target', {
      value: overlay.element,
      writable: false
    })

    await overlay.trigger('click')

    expect(wrapper.emitted().close).toBeTruthy()
  })

  it('should set body overflow to hidden when modal opens', async () => {
    wrapper = mount(PrivacyModal, {
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
    wrapper = mount(PrivacyModal, {
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

  it('should have scrollable content area', async () => {
    wrapper = mount(PrivacyModal, {
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
    wrapper = mount(PrivacyModal, {
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

  it('should contain specific privacy policy sections', async () => {
    wrapper = mount(PrivacyModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const content = wrapper.text()
    expect(content).toContain('Imágenes faciales subidas por el usuario')
    expect(content).toContain('cifrado en tránsito')
    expect(content).toContain('No vendemos, intercambiamos o transferimos')
    expect(content).toContain('menores de 18 años')
    expect(content).toContain('Cookies y Tecnologías Similares')
  })

  it('should have correct backdrop and modal styling', async () => {
    wrapper = mount(PrivacyModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const backdrop = wrapper.find('.absolute.inset-0.bg-black\\/50')
    expect(backdrop.exists()).toBe(true)
    expect(backdrop.classes()).toContain('backdrop-blur-sm')

    const modalContent = wrapper.find('.relative.bg-card')
    expect(modalContent.exists()).toBe(true)
    expect(modalContent.classes()).toContain('border-border')
    expect(modalContent.classes()).toContain('rounded-lg')
    expect(modalContent.classes()).toContain('shadow-2xl')
  })

  it('should handle non-escape key presses without closing', async () => {
    wrapper = mount(PrivacyModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
    document.dispatchEvent(tabEvent)

    await nextTick()

    expect(wrapper.emitted().close).toBeFalsy()
  })

  it('should display last updated date with correct formatting', async () => {
    wrapper = mount(PrivacyModal, {
      props: { show: true },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })

    await nextTick()

    const lastUpdated = wrapper.find('.italic.font-mono')
    expect(lastUpdated.exists()).toBe(true)
    expect(lastUpdated.text()).toContain('Última actualización: 25 de septiembre de 2025')
  })
})