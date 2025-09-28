import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAnalysisStore } from '../analysis-store';
import { createMockAnalysis, createMockUploadProgress } from '@/test/utils';
import { ANALYSIS_STATUS } from '@/consts';

describe('Analysis Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const store = useAnalysisStore();

    expect(store.analyses).toEqual([]);
    expect(store.currentAnalysis).toBe(null);
    expect(store.isAnalyzing).toBe(false);
    expect(store.uploadProgress).toEqual({
      loaded: 0,
      total: 0,
      percentage: 0,
    });
  });

  describe('Current Analysis', () => {
    it('should set current analysis', () => {
      const store = useAnalysisStore();
      const mockAnalysis = createMockAnalysis();

      store.setCurrentAnalysis(mockAnalysis);

      expect(store.currentAnalysis).toEqual(mockAnalysis);
    });

    it('should clear current analysis', () => {
      const store = useAnalysisStore();
      const mockAnalysis = createMockAnalysis();

      store.setCurrentAnalysis(mockAnalysis);
      expect(store.currentAnalysis).toEqual(mockAnalysis);

      store.setCurrentAnalysis(null);
      expect(store.currentAnalysis).toBe(null);
    });
  });

  describe('Analyses Management', () => {
    it('should add analysis to beginning of array', () => {
      const store = useAnalysisStore();
      const analysis1 = createMockAnalysis({ id: '1' });
      const analysis2 = createMockAnalysis({ id: '2' });

      store.addAnalysis(analysis1);
      store.addAnalysis(analysis2);

      expect(store.analyses).toHaveLength(2);
      expect(store.analyses[0]).toEqual(analysis2);
      expect(store.analyses[1]).toEqual(analysis1);
    });

    it('should get analysis by id', () => {
      const store = useAnalysisStore();
      const analysis1 = createMockAnalysis({ id: '1' });
      const analysis2 = createMockAnalysis({ id: '2' });

      store.addAnalysis(analysis1);
      store.addAnalysis(analysis2);

      expect(store.getAnalysisById('1')).toEqual(analysis1);
      expect(store.getAnalysisById('2')).toEqual(analysis2);
      expect(store.getAnalysisById('3')).toBeUndefined();
    });
  });

  describe('Upload Progress', () => {
    it('should set upload progress', () => {
      const store = useAnalysisStore();
      const progress = createMockUploadProgress({ percentage: 75 });

      store.setUploadProgress(progress);

      expect(store.uploadProgress).toEqual(progress);
    });

    it('should reset upload progress', () => {
      const store = useAnalysisStore();
      const progress = createMockUploadProgress({ percentage: 100 });

      store.setUploadProgress(progress);
      expect(store.uploadProgress.percentage).toBe(100);

      store.resetUploadProgress();
      expect(store.uploadProgress).toEqual({
        loaded: 0,
        total: 0,
        percentage: 0,
      });
    });
  });

  describe('Analyzing State', () => {
    it('should set analyzing state', () => {
      const store = useAnalysisStore();

      store.setAnalyzing(true);
      expect(store.isAnalyzing).toBe(true);

      store.setAnalyzing(false);
      expect(store.isAnalyzing).toBe(false);
    });
  });

  describe('Computed Properties', () => {

    it('should filter feasible analyses', () => {
      const store = useAnalysisStore();

      const feasible1 = createMockAnalysis({
        id: '1',
        status: ANALYSIS_STATUS.FEASIBLE,
        analysis_date: '2024-01-01T00:00:00Z'
      });
      const denied = createMockAnalysis({
        id: '2',
        status: ANALYSIS_STATUS.DENIED,
        analysis_date: '2024-01-01T00:00:00Z'
      });
      const feasible2 = createMockAnalysis({
        id: '3',
        status: ANALYSIS_STATUS.FEASIBLE,
        analysis_date: '2024-01-01T00:00:00Z'
      });

      store.addAnalysis(feasible1);
      store.addAnalysis(denied);
      store.addAnalysis(feasible2);

      expect(store.feasibleAnalyses).toHaveLength(2);
      expect(store.feasibleAnalyses).toEqual([feasible2, feasible1]);
    });

    it('should calculate average score correctly', () => {
      const store = useAnalysisStore();

      store.addAnalysis(createMockAnalysis({
        overall_score: 8.0,
        status: ANALYSIS_STATUS.FEASIBLE,
        analysis_date: '2024-01-01T00:00:00Z'
      }));
      store.addAnalysis(createMockAnalysis({
        overall_score: 6.0,
        status: ANALYSIS_STATUS.FEASIBLE,
        analysis_date: '2024-01-01T00:00:00Z'
      }));
      store.addAnalysis(createMockAnalysis({
        overall_score: 5.0,
        status: ANALYSIS_STATUS.DENIED,
        analysis_date: '2024-01-01T00:00:00Z'
      })); // Should be excluded

      expect(store.averageScore).toBe(7.0);
    });

    it('should return 0 for average score when no feasible analyses', () => {
      const store = useAnalysisStore();

      store.addAnalysis(createMockAnalysis({
        status: ANALYSIS_STATUS.DENIED,
        analysis_date: '2024-01-01T00:00:00Z'
      }));

      expect(store.averageScore).toBe(0);
    });

    it('should calculate total analyses', () => {
      const store = useAnalysisStore();

      store.addAnalysis(createMockAnalysis({ id: '1' }));
      store.addAnalysis(createMockAnalysis({ id: '2' }));
      store.addAnalysis(createMockAnalysis({ id: '3' }));

      expect(store.totalAnalyses).toBe(3);
    });

    it('should calculate total feasible analyses', () => {
      const store = useAnalysisStore();

      store.addAnalysis(createMockAnalysis({
        id: '1',
        status: ANALYSIS_STATUS.FEASIBLE
      }));
      store.addAnalysis(createMockAnalysis({
        id: '2',
        status: ANALYSIS_STATUS.DENIED
      }));
      store.addAnalysis(createMockAnalysis({
        id: '3',
        status: ANALYSIS_STATUS.FEASIBLE
      }));

      expect(store.totalFeasibleAnalyses).toBe(2);
    });

    it('should calculate score distribution', () => {
      const store = useAnalysisStore();

      store.addAnalysis(createMockAnalysis({
        overall_score: 9.0,
        status: ANALYSIS_STATUS.FEASIBLE
      })); // excellent
      store.addAnalysis(createMockAnalysis({
        overall_score: 7.0,
        status: ANALYSIS_STATUS.FEASIBLE
      })); // good
      store.addAnalysis(createMockAnalysis({
        overall_score: 5.0,
        status: ANALYSIS_STATUS.FEASIBLE
      })); // average
      store.addAnalysis(createMockAnalysis({
        overall_score: 3.0,
        status: ANALYSIS_STATUS.FEASIBLE
      })); // poor
      store.addAnalysis(createMockAnalysis({
        overall_score: 8.0,
        status: ANALYSIS_STATUS.DENIED
      })); // Should be excluded

      const distribution = store.scoreDistribution;
      expect(distribution.excellent).toBe(1);
      expect(distribution.good).toBe(1);
      expect(distribution.average).toBe(1);
      expect(distribution.poor).toBe(1);
    });

    it('should find best score', () => {
      const store = useAnalysisStore();

      store.addAnalysis(createMockAnalysis({
        overall_score: 7.5,
        status: ANALYSIS_STATUS.FEASIBLE
      }));
      store.addAnalysis(createMockAnalysis({
        overall_score: 9.2,
        status: ANALYSIS_STATUS.FEASIBLE
      }));
      store.addAnalysis(createMockAnalysis({
        overall_score: 8.1,
        status: ANALYSIS_STATUS.FEASIBLE
      }));
      store.addAnalysis(createMockAnalysis({
        overall_score: 9.8,
        status: ANALYSIS_STATUS.DENIED
      })); // Should be excluded

      expect(store.bestScore).toBe(9.2);
    });

    it('should return 0 for best score when no feasible analyses', () => {
      const store = useAnalysisStore();

      store.addAnalysis(createMockAnalysis({
        status: ANALYSIS_STATUS.DENIED
      }));

      expect(store.bestScore).toBe(0);
    });

    it('should get recent analyses (max 5, sorted by date)', () => {
      const store = useAnalysisStore();

      // Add 6 feasible analyses with different dates
      for (let i = 0; i < 6; i++) {
        store.addAnalysis(createMockAnalysis({
          id: i.toString(),
          status: ANALYSIS_STATUS.FEASIBLE,
          analysis_date: `2024-01-0${i + 1}T00:00:00Z`
        }));
      }

      const recent = store.recentAnalyses;
      expect(recent).toHaveLength(5);
      // Should be sorted by date descending (most recent first)
      expect(recent[0].analysis_date).toBe('2024-01-06T00:00:00Z');
      expect(recent[4].analysis_date).toBe('2024-01-02T00:00:00Z');
    });

    it('should get latest analysis', () => {
      const store = useAnalysisStore();

      const older = createMockAnalysis({
        id: '1',
        analysis_date: '2024-01-01T00:00:00Z'
      });
      const newer = createMockAnalysis({
        id: '2',
        analysis_date: '2024-01-02T00:00:00Z'
      });

      store.addAnalysis(older);
      store.addAnalysis(newer);

      expect(store.latestAnalysis).toEqual(newer);
    });

    it('should return null for latest analysis when no analyses', () => {
      const store = useAnalysisStore();

      expect(store.latestAnalysis).toBe(null);
    });
  });
});