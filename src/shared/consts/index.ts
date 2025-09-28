// Global shared constants
export const ROUTES = {
  HOME: "/",
  MAKE_BEAUTY: "/make-beauty",
  RESULTS: "/results",
  SUMMARY: "/summary",
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 0.3,
  NORMAL: 0.5,
  SLOW: 0.8,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

export const API_ENDPOINTS = {
  ANALYZE: "/api/analysis/",
  ANALYSES: "/api/analysis/",
  ANALYSIS: "/api/analysis",
  STATS: "/api/stats/",
  HEALTH: "/api/health/",
} as const;