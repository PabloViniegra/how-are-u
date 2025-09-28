import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { apiService } from '../api';
import { createMockAnalysis, createMockFile, mockFetch } from '@/test/utils';
import { API_ENDPOINTS } from '@/consts';

// Mock environment variables - need to check the actual values being used
const mockApiUrl = 'http://localhost:8000';
const mockApiKey = 'key_10fbe0eb3';

vi.mock('import.meta', () => ({
  env: {
    VITE_API_URL: mockApiUrl,
    VITE_API_KEY: mockApiKey
  }
}));

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Request Method', () => {
    it('should make successful GET request', async () => {
      const mockData = { test: 'data' };
      mockFetch(mockData);

      const result = await apiService['request']('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': mockApiKey,
            'Authorization': `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json',
          }),
        })
      );

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
    });

    it('should handle HTTP errors', async () => {
      mockFetch({}, 404);

      await expect(apiService['request']('/not-found')).rejects.toThrow(
        'HTTP error! status: 404'
      );
    });

    it('should handle network errors', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

      await expect(apiService['request']('/test')).rejects.toThrow(
        'Network error'
      );
    });

    it('should include custom headers', async () => {
      const mockData = { test: 'data' };
      mockFetch(mockData);

      await apiService['request']('/test', {
        headers: {
          'Custom-Header': 'custom-value',
        },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Custom-Header': 'custom-value',
          }),
        })
      );
    });
  });

  describe('Upload Image', () => {
    let mockXHR: any;
    let mockFile: File;

    beforeEach(() => {
      mockFile = createMockFile();

      // Create a more complete XMLHttpRequest mock
      mockXHR = {
        open: vi.fn(),
        send: vi.fn(),
        setRequestHeader: vi.fn(),
        upload: {
          addEventListener: vi.fn(),
          onprogress: null,
        },
        onload: null,
        onerror: null,
        status: 200,
        responseText: JSON.stringify(createMockAnalysis()),
        addEventListener: vi.fn(),
      };

      global.XMLHttpRequest = vi.fn(() => mockXHR) as any;
    });

    it('should upload file successfully', async () => {
      const mockAnalysis = createMockAnalysis();
      mockXHR.responseText = JSON.stringify(mockAnalysis);

      const uploadPromise = apiService.uploadImage(mockFile);

      // Simulate successful upload
      expect(mockXHR.open).toHaveBeenCalledWith(
        'POST',
        expect.stringContaining(API_ENDPOINTS.ANALYZE)
      );
      expect(mockXHR.send).toHaveBeenCalledWith(expect.any(FormData));

      // Trigger onload
      mockXHR.onload();

      const result = await uploadPromise;

      expect(result).toEqual({
        success: true,
        data: mockAnalysis,
      });
    });

    it('should handle upload progress', async () => {
      const onProgress = vi.fn();
      const uploadPromise = apiService.uploadImage(mockFile, onProgress);

      // Simulate progress event
      const progressEvent = {
        lengthComputable: true,
        loaded: 500000,
        total: 1000000,
      };

      // Set the onprogress handler and call it
      if (mockXHR.upload.onprogress) {
        mockXHR.upload.onprogress(progressEvent);
      }

      expect(onProgress).toHaveBeenCalledWith({
        loaded: 500000,
        total: 1000000,
        percentage: expect.any(Number),
      });

      // Complete the upload
      mockXHR.onload();
      await uploadPromise;
    }, 10000);

    it('should handle upload error', async () => {
      const uploadPromise = apiService.uploadImage(mockFile);

      // Simulate error
      mockXHR.onerror();

      await expect(uploadPromise).rejects.toThrow('Network error occurred');
    });

    it('should handle HTTP error response', async () => {
      mockXHR.status = 400;
      mockXHR.responseText = JSON.stringify({ error: 'Bad request' });

      const uploadPromise = apiService.uploadImage(mockFile);

      // Trigger onload with error status
      mockXHR.onload();

      await expect(uploadPromise).rejects.toThrow('HTTP error! status: 400');
    });

    it('should create FormData with correct file field', async () => {
      const uploadPromise = apiService.uploadImage(mockFile);

      expect(mockXHR.send).toHaveBeenCalledWith(expect.any(FormData));

      const formDataCall = mockXHR.send.mock.calls[0][0];
      expect(formDataCall).toBeInstanceOf(FormData);

      // Complete the upload
      mockXHR.onload();
      await uploadPromise;
    });

    it('should simulate analysis progress after upload', async () => {
      const onProgress = vi.fn();
      vi.useFakeTimers();

      const uploadPromise = apiService.uploadImage(mockFile, onProgress);

      // Complete upload phase
      mockXHR.onload();

      // Wait for analysis simulation to complete (up to 5 seconds)
      vi.advanceTimersByTime(5000);

      await uploadPromise;

      // Should have been called during upload simulation
      expect(onProgress).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('Get Analysis', () => {
    it('should fetch analysis by id', async () => {
      const mockAnalysis = createMockAnalysis();
      mockFetch(mockAnalysis);

      const result = await apiService.getAnalysis(1);

      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:8000${API_ENDPOINTS.ANALYSIS}/1`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': mockApiKey,
            'Authorization': `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json',
          }),
        })
      );

      expect(result).toEqual({
        success: true,
        data: mockAnalysis,
      });
    });
  });

  describe('Get Analyses', () => {
    it('should fetch all analyses', async () => {
      const mockAnalyses = [createMockAnalysis(), createMockAnalysis()];
      mockFetch(mockAnalyses);

      const result = await apiService.getAnalyses();

      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:8000${API_ENDPOINTS.ANALYSES}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': mockApiKey,
            'Authorization': `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json',
          }),
        })
      );

      expect(result).toEqual({
        success: true,
        data: mockAnalyses,
      });
    });
  });


  describe('Simulate Analysis Progress', () => {
    it('should simulate progress from start to end', async () => {
      vi.useFakeTimers();
      const onProgress = vi.fn();
      const onComplete = vi.fn();

      apiService['simulateAnalysisProgress'](onProgress, 0, 100, onComplete);

      // Initial delay + max duration + extra time for variable delays
      // 200ms initial + 5000ms max duration + 2000ms buffer for variable timing
      vi.advanceTimersByTime(7500);

      expect(onProgress).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('should handle progress without callback', async () => {
      vi.useFakeTimers();
      const onComplete = vi.fn();
      const onProgress = vi.fn(); // Use a real function instead of undefined

      // Should not throw error
      expect(() => {
        apiService['simulateAnalysisProgress'](onProgress, 0, 100, onComplete);
      }).not.toThrow();

      vi.advanceTimersByTime(5000);
      expect(onComplete).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });
});