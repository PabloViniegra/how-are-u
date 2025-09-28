import type { Analysis, APIResponse, AnalysisRequest, UploadProgress } from '@/types';
import { API_ENDPOINTS } from '@/consts';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

class APIService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = API_URL;
    this.apiKey = API_KEY;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = new URL(endpoint, this.baseURL);

    const config: RequestInit = {
      headers: {
        'X-API-Key': this.apiKey,
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url.toString(), config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<APIResponse<Analysis>> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file); // API expects 'file' not 'image'

      const xhr = new XMLHttpRequest();
      const url = new URL(API_ENDPOINTS.ANALYZE, this.baseURL);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const uploadProgress = Math.round((event.loaded / event.total) * 70); // Upload takes 70% of total progress
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: uploadProgress,
          };
          onProgress(progress);
        }
      };

      xhr.onload = () => {

        if (onProgress) {
          // Simulate analysis progress after upload completes
          this.simulateAnalysisProgress(onProgress, 70, 100, () => {
            try {
              const response = JSON.parse(xhr.responseText);
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve({ success: true, data: response });
              } else {
                reject(new Error(`HTTP error! status: ${xhr.status}`));
              }
            } catch (error) {
              reject(new Error('Failed to parse response'));
            }
          });
        } else {
          try {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({ success: true, data: response });
            } else {
              reject(new Error(`HTTP error! status: ${xhr.status}`));
            }
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error occurred'));
      };

      xhr.ontimeout = () => {
        reject(new Error('Request timeout'));
      };

      xhr.timeout = 120000; // 2 minutes timeout for analysis

      xhr.open('POST', url.toString());

      // Set headers after opening connection
      xhr.setRequestHeader('X-API-Key', this.apiKey);
      xhr.setRequestHeader('Authorization', `Bearer ${this.apiKey}`);

      xhr.send(formData);
    });
  }

  private simulateAnalysisProgress(
    onProgress: (progress: UploadProgress) => void,
    startPercent: number,
    endPercent: number,
    onComplete: () => void
  ): void {
    const duration = 3000 + Math.random() * 2000; // 3-5 seconds for analysis simulation
    const steps = 20;
    const stepDuration = duration / steps;
    const progressStep = (endPercent - startPercent) / steps;

    let currentStep = 0;

    const updateProgress = () => {
      if (currentStep >= steps) {
        onProgress({
          loaded: 100,
          total: 100,
          percentage: endPercent
        });
        onComplete();
        return;
      }

      const currentPercent = startPercent + (progressStep * currentStep);
      // Add some randomness to make it more realistic
      const variance = Math.random() * 2 - 1; // -1 to +1
      const percentage = Math.min(Math.max(currentPercent + variance, startPercent), endPercent - 1);

      onProgress({
        loaded: percentage,
        total: 100,
        percentage: Math.round(percentage)
      });

      currentStep++;

      // Use variable timing to make it more natural
      const nextDelay = stepDuration * (0.8 + Math.random() * 0.4); // 80%-120% of base duration
      setTimeout(updateProgress, nextDelay);
    };

    // Start the simulation after a short delay
    setTimeout(updateProgress, 200);
  }

  async analyzeImage(request: AnalysisRequest): Promise<APIResponse<Analysis>> {
    const formData = new FormData();
    formData.append('image', request.image);

    if (request.options) {
      formData.append('options', JSON.stringify(request.options));
    }

    const url = new URL(API_ENDPOINTS.ANALYZE, this.baseURL);
    url.searchParams.append('x-api-key', this.apiKey);

    const response = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  async getAnalyses(): Promise<APIResponse<Analysis[]>> {
    return this.request<Analysis[]>(API_ENDPOINTS.ANALYSES);
  }

  async getAnalysis(id: number): Promise<APIResponse<Analysis>> {
    return this.request<Analysis>(`${API_ENDPOINTS.ANALYSIS}/${id}`);
  }

  async deleteAnalysis(id: number): Promise<APIResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(`${API_ENDPOINTS.ANALYSIS}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new APIService();
export default apiService;