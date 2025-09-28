import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useImageUpload } from '../useImageUpload'
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from '@/consts'

// Mock URL.createObjectURL and revokeObjectURL
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

global.URL = {
  createObjectURL: mockCreateObjectURL,
  revokeObjectURL: mockRevokeObjectURL
} as any

describe('useImageUpload Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateObjectURL.mockReturnValue('mock-blob-url')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { selectedFile, previewUrl, uploadError } = useImageUpload()

      expect(selectedFile.value).toBeNull()
      expect(previewUrl.value).toBeNull()
      expect(uploadError.value).toBeNull()
    })
  })

  describe('File Validation', () => {
    it('should accept valid image types', () => {
      const { validateFile } = useImageUpload()

      ACCEPTED_IMAGE_TYPES.forEach(type => {
        const mockFile = new File(['test'], 'test.jpg', { type })
        const result = validateFile(mockFile)
        expect(result).toBeNull()
      })
    })

    it('should reject invalid file types', () => {
      const { validateFile } = useImageUpload()

      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      const result = validateFile(invalidFile)

      expect(result).toBe('Tipo de archivo no válido. Solo se permiten JPG, PNG y WebP.')
    })

    it('should reject files that are too large', () => {
      const { validateFile } = useImageUpload()

      const largeFile = new File(['x'.repeat(MAX_FILE_SIZE + 1)], 'large.jpg', {
        type: 'image/jpeg'
      })
      const result = validateFile(largeFile)

      expect(result).toBe(`El archivo es muy grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB permitidos.`)
    })

    it('should accept files within size limit', () => {
      const { validateFile } = useImageUpload()

      const validFile = new File(['test'], 'valid.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now()
      })
      // Mock the size property
      Object.defineProperty(validFile, 'size', { value: MAX_FILE_SIZE - 1000 })

      const result = validateFile(validFile)
      expect(result).toBeNull()
    })
  })

  describe('File Selection', () => {
    it('should select valid file and create preview URL', () => {
      const { selectFile, selectedFile, previewUrl, uploadError } = useImageUpload()

      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(validFile, 'size', { value: 1000 })

      const result = selectFile(validFile)

      expect(result).toBe(true)
      expect(selectedFile.value).toBe(validFile)
      expect(previewUrl.value).toBe('mock-blob-url')
      expect(uploadError.value).toBeNull()
      expect(mockCreateObjectURL).toHaveBeenCalledWith(validFile)
    })

    it('should reject invalid file and set error', () => {
      const { selectFile, selectedFile, previewUrl, uploadError } = useImageUpload()

      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })

      const result = selectFile(invalidFile)

      expect(result).toBe(false)
      expect(selectedFile.value).toBeNull()
      expect(previewUrl.value).toBeNull()
      expect(uploadError.value).toBe('Tipo de archivo no válido. Solo se permiten JPG, PNG y WebP.')
      expect(mockCreateObjectURL).not.toHaveBeenCalled()
    })

    it('should revoke previous preview URL when selecting new file', () => {
      const { selectFile, previewUrl } = useImageUpload()

      // Select first file
      const firstFile = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' })
      Object.defineProperty(firstFile, 'size', { value: 1000 })
      selectFile(firstFile)

      const firstUrl = previewUrl.value
      expect(firstUrl).toBe('mock-blob-url')

      // Select second file
      mockCreateObjectURL.mockReturnValue('mock-blob-url-2')
      const secondFile = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
      Object.defineProperty(secondFile, 'size', { value: 1000 })
      selectFile(secondFile)

      expect(mockRevokeObjectURL).toHaveBeenCalledWith(firstUrl)
      expect(previewUrl.value).toBe('mock-blob-url-2')
    })

    it('should not revoke URL if no previous URL exists', () => {
      const { selectFile } = useImageUpload()

      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(validFile, 'size', { value: 1000 })

      selectFile(validFile)

      expect(mockRevokeObjectURL).not.toHaveBeenCalled()
    })
  })

  describe('File Clearing', () => {
    it('should clear file and reset state', () => {
      const { selectFile, clearFile, selectedFile, previewUrl, uploadError } = useImageUpload()

      // First select a file
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(validFile, 'size', { value: 1000 })
      selectFile(validFile)

      // Then clear it
      clearFile()

      expect(selectedFile.value).toBeNull()
      expect(previewUrl.value).toBeNull()
      expect(uploadError.value).toBeNull()
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-blob-url')
    })

    it('should not revoke URL if no preview URL exists', () => {
      const { clearFile } = useImageUpload()

      clearFile()

      expect(mockRevokeObjectURL).not.toHaveBeenCalled()
    })
  })

  describe('File Input Handler', () => {
    it('should handle file input event with valid file', () => {
      const { handleFileInput, selectedFile } = useImageUpload()

      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(validFile, 'size', { value: 1000 })

      const mockEvent = {
        target: {
          files: [validFile]
        }
      } as any

      handleFileInput(mockEvent)

      expect(selectedFile.value).toBe(validFile)
    })

    it('should handle file input event with no file', () => {
      const { handleFileInput, selectedFile } = useImageUpload()

      const mockEvent = {
        target: {
          files: []
        }
      } as any

      handleFileInput(mockEvent)

      expect(selectedFile.value).toBeNull()
    })

    it('should handle file input event with null files', () => {
      const { handleFileInput, selectedFile } = useImageUpload()

      const mockEvent = {
        target: {
          files: null
        }
      } as any

      handleFileInput(mockEvent)

      expect(selectedFile.value).toBeNull()
    })
  })

  describe('File Drop Handler', () => {
    it('should handle drop event with valid file', () => {
      const { handleFileDrop, selectedFile } = useImageUpload()

      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(validFile, 'size', { value: 1000 })

      const mockEvent = {
        preventDefault: vi.fn(),
        dataTransfer: {
          files: [validFile]
        }
      } as any

      handleFileDrop(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(selectedFile.value).toBe(validFile)
    })

    it('should handle drop event with no files', () => {
      const { handleFileDrop, selectedFile } = useImageUpload()

      const mockEvent = {
        preventDefault: vi.fn(),
        dataTransfer: {
          files: []
        }
      } as any

      handleFileDrop(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(selectedFile.value).toBeNull()
    })

    it('should handle drop event with null dataTransfer', () => {
      const { handleFileDrop, selectedFile } = useImageUpload()

      const mockEvent = {
        preventDefault: vi.fn(),
        dataTransfer: null
      } as any

      handleFileDrop(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(selectedFile.value).toBeNull()
    })
  })

  describe('Return Values', () => {
    it('should return all expected properties and methods', () => {
      const result = useImageUpload()

      expect(result).toHaveProperty('selectedFile')
      expect(result).toHaveProperty('previewUrl')
      expect(result).toHaveProperty('uploadError')
      expect(result).toHaveProperty('selectFile')
      expect(result).toHaveProperty('clearFile')
      expect(result).toHaveProperty('handleFileInput')
      expect(result).toHaveProperty('handleFileDrop')
      expect(result).toHaveProperty('validateFile')

      expect(typeof result.selectFile).toBe('function')
      expect(typeof result.clearFile).toBe('function')
      expect(typeof result.handleFileInput).toBe('function')
      expect(typeof result.handleFileDrop).toBe('function')
      expect(typeof result.validateFile).toBe('function')
    })
  })
})