import { vi } from 'vitest';
import type { Analysis, UploadProgress } from '@/types';
import { ANALYSIS_STATUS } from '@/consts';

// Mock data factories
export const createMockAnalysis = (overrides: Partial<Analysis> = {}): Analysis => ({
  id: '1',
  status: ANALYSIS_STATUS.FEASIBLE,
  overall_score: 8.5,
  detailed_scores: {
    facial_symmetry: 8.2,
    skin_quality: 7.8,
    facial_proportions: 8.9,
    eye_features: 8.1,
  },
  additional_scores: {
    attractiveness: 8.3,
    youthfulness: 7.9,
    health_appearance: 8.7,
  },
  scientific_explanation: 'Mock scientific explanation',
  recommendations: 'Mock recommendations',
  analysis_date: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockUploadProgress = (overrides: Partial<UploadProgress> = {}): UploadProgress => ({
  loaded: 500000,
  total: 1000000,
  percentage: 50,
  ...overrides,
});

// Mock File
export const createMockFile = (name = 'test.jpg', type = 'image/jpeg', size = 1000000): File => {
  const file = new File(['mock content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Router mock
export const createMockRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      name: 'home',
      params: {},
      query: {},
      meta: {},
    }
  }
});

// Query client mock for TanStack Query
export const createMockQueryClient = () => ({
  getQueryData: vi.fn(),
  setQueryData: vi.fn(),
  invalidateQueries: vi.fn(),
  removeQueries: vi.fn(),
  clear: vi.fn(),
});

// Mutation mock
export const createMockMutation = (overrides = {}) => ({
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  reset: vi.fn(),
  isIdle: { value: true },
  isPending: { value: false },
  isError: { value: false },
  isSuccess: { value: false },
  data: { value: null },
  error: { value: null },
  ...overrides,
});

// Wait for next tick utility
export const nextTick = () => new Promise(resolve => setTimeout(resolve, 0));

// Wait for specific time
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock DOM methods
export const mockDOMMethod = (element: string, method: string, returnValue?: any) => {
  const elements = document.querySelectorAll(element);
  elements.forEach(el => {
    (el as any)[method] = vi.fn().mockReturnValue(returnValue);
  });
};

// Create mock event
export const createMockEvent = (type: string, properties: Record<string, any> = {}) => {
  const event = new Event(type);
  Object.assign(event, properties);
  return event;
};

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  global.localStorage = {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: 0,
    key: vi.fn(),
  };

  return store;
};

// Mock fetch
export const mockFetch = (response: any = {}, status = 200) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(response),
    text: vi.fn().mockResolvedValue(JSON.stringify(response)),
    headers: new Headers(),
  });

  return fetch as ReturnType<typeof vi.fn>;
};

// Create a test wrapper with common providers
export const createTestWrapper = (options: {
  router?: any;
  pinia?: any;
  queryClient?: any;
} = {}) => {
  return {
    global: {
      plugins: [
        ...(options.pinia ? [options.pinia] : []),
        ...(options.router ? [options.router] : []),
      ],
      stubs: {
        teleport: true,
        'router-link': true,
        'router-view': true,
      },
    },
  };
};