export interface Analysis {
  id: string;
  status: 'denied' | 'improvable' | 'feasible';
  overall_score: number;
  detailed_scores: Record<string, number>;
  additional_scores?: Record<string, number> | null;
  scientific_explanation: string;
  recommendations: string;
  analysis_date: string;
  image_url?: string;
}

export interface BeautyFeatures {
  facial_symmetry: number;
  skin_quality: number;
  facial_proportions: number;
  eye_features: number;
  nose_shape: number;
  lip_shape: number;
  jawline: number;
  cheekbones: number;
}

export interface DetailedScores {
  attractiveness: number;
  youthfulness: number;
  health_appearance: number;
  confidence_level: number;
  approachability: number;
}

export interface AnalysisMetadata {
  processing_time: number;
  model_version: string;
  confidence_score: number;
  image_quality: ImageQuality;
}

export interface ImageQuality {
  resolution: string;
  lighting: 'poor' | 'fair' | 'good' | 'excellent';
  clarity: 'poor' | 'fair' | 'good' | 'excellent';
  angle: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface AnalysisRequest {
  image: File;
  options?: AnalysisOptions;
}

export interface AnalysisOptions {
  include_recommendations?: boolean;
  detailed_analysis?: boolean;
  compare_with_standards?: boolean;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface ScoreDistribution {
  excellent: number; // 8-10
  good: number; // 6-8
  average: number; // 4-6
  poor: number; // 0-4
}

export interface AnalysisStats {
  total_analyses: number;
  average_score: number;
  best_score: number;
  latest_analysis: Analysis | null;
  score_distribution: ScoreDistribution;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}