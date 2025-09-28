// Global shared types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface ImageQuality {
  resolution: string;
  lighting: 'poor' | 'fair' | 'good' | 'excellent';
  clarity: 'poor' | 'fair' | 'good' | 'excellent';
  angle: 'poor' | 'fair' | 'good' | 'excellent';
}