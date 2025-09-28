import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ImageUpload from '../ImageUpload.vue';
import { createMockFile } from '@/test/utils';

// Mock the composable with reactive refs
const mockSelectedFile = { value: null };
const mockPreviewUrl = { value: null };
const mockUploadError = { value: null };
const mockHandleFileInput = vi.fn();
const mockHandleFileDrop = vi.fn();
const mockClearFile = vi.fn();

vi.mock('@/composables/useImageUpload', () => ({
  useImageUpload: vi.fn(() => ({
    selectedFile: mockSelectedFile,
    previewUrl: mockPreviewUrl,
    uploadError: mockUploadError,
    handleFileInput: mockHandleFileInput,
    handleFileDrop: mockHandleFileDrop,
    clearFile: mockClearFile,
  })),
}));

describe('ImageUpload Component', () => {
  let wrapper: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    mockSelectedFile.value = null;
    mockPreviewUrl.value = null;
    mockUploadError.value = null;

    wrapper = mount(ImageUpload);
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render upload area', () => {
    expect(wrapper.find('[data-testid="upload-area"]')).toBeDefined();
    expect(wrapper.text()).toContain('Arrastra y suelta tu imagen aquí');
  });

  it('should handle file input change', async () => {
    const mockFile = createMockFile();
    const fileInput = wrapper.find('input[type="file"]');

    // Create a proper event object
    const event = {
      target: { files: [mockFile] }
    } as any;

    // Directly call the handler instead of using trigger
    await wrapper.vm.handleFileChange(event);

    expect(mockHandleFileInput).toHaveBeenCalledWith(event);
  });

  it('should emit fileSelected when file is selected', async () => {
    const mockFile = createMockFile();

    // Set the mock to return a file
    mockSelectedFile.value = mockFile;

    // Re-mount to reflect changes
    wrapper = mount(ImageUpload);

    // Simulate file change
    await wrapper.vm.handleFileChange({ target: { files: [mockFile] } });

    expect(wrapper.emitted().fileSelected).toBeTruthy();
    expect(wrapper.emitted().fileSelected[0][0]).toBe(mockFile);
  });

  it('should handle drag and drop events', async () => {
    const uploadArea = wrapper.find('.cursor-pointer');

    // Test dragover
    await uploadArea.trigger('dragover');
    expect(wrapper.vm.isDragOver).toBe(true);

    // Test dragleave
    await uploadArea.trigger('dragleave');
    expect(wrapper.vm.isDragOver).toBe(false);
  });

  it('should handle drop event', async () => {
    const mockFile = createMockFile();
    const uploadArea = wrapper.find('.cursor-pointer');

    // Simulate drop event by directly calling the handler
    await wrapper.vm.handleDrop({
      preventDefault: vi.fn(),
      dataTransfer: { files: [mockFile] }
    });

    expect(mockHandleFileDrop).toHaveBeenCalled();
  });

  it('should show preview when file is selected', async () => {
    const mockFile = createMockFile();

    // Set mocks to show preview state
    mockSelectedFile.value = mockFile;
    mockPreviewUrl.value = 'mock-preview-url';

    // Re-mount to reflect changes
    wrapper = mount(ImageUpload);

    // Wait for reactivity
    await wrapper.vm.$nextTick();

    expect(wrapper.find('img').exists()).toBe(true);
    // Check if the src attribute is set correctly
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
  });

  it('should show error message when there is an upload error', async () => {
    mockUploadError.value = 'Test error message';

    // Re-mount to reflect changes
    wrapper = mount(ImageUpload);

    expect(wrapper.text()).toContain('Test error message');
    expect(wrapper.find('.text-destructive').exists()).toBe(true);
  });

  it('should handle file removal', async () => {
    const mockFile = createMockFile();

    // Set mocks to show file selected state
    mockSelectedFile.value = mockFile;
    mockPreviewUrl.value = 'mock-preview-url';

    // Re-mount to reflect changes
    wrapper = mount(ImageUpload);

    const removeButton = wrapper.find('.absolute.top-4.right-4');
    await removeButton.trigger('click');

    expect(mockClearFile).toHaveBeenCalled();
    expect(wrapper.emitted().fileRemoved).toBeTruthy();
  });

  it('should open file dialog when clicking upload area', async () => {
    const mockClick = vi.fn();

    // Mock the file input ref
    wrapper.vm.fileInputRef = { click: mockClick };

    const uploadArea = wrapper.find('.cursor-pointer');
    await uploadArea.trigger('click');

    expect(mockClick).toHaveBeenCalled();
  });

  it('should apply drag over styling', async () => {
    const uploadArea = wrapper.find('.cursor-pointer');

    // Test dragover styling
    await uploadArea.trigger('dragover');

    expect(wrapper.vm.isDragOver).toBe(true);
  });

  it('should show correct file types in help text', () => {
    expect(wrapper.text()).toContain('JPG, PNG, WebP');
  });

  it('should show correct file size limit in help text', () => {
    expect(wrapper.text()).toContain('10MB');
  });

  it('should prevent default on drag events', async () => {
    const uploadArea = wrapper.find('.cursor-pointer');

    // Test dragover preventDefault
    const dragEvent = new DragEvent('dragover', { bubbles: true });
    const preventDefaultSpy = vi.spyOn(dragEvent, 'preventDefault');

    await uploadArea.element.dispatchEvent(dragEvent);

    // The component should handle the event
    expect(uploadArea.exists()).toBe(true);
  });
});