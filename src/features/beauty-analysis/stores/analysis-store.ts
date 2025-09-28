import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UploadProgress } from "@/shared/types";
import type { Analysis } from "../types";

export const useAnalysisStore = defineStore("analysis", () => {
  // State
  const analyses = ref<Analysis[]>([]);
  const currentAnalysis = ref<Analysis | null>(null);
  const isAnalyzing = ref(false);
  const uploadProgress = ref<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });

  // Getters
  const getAnalysisById = computed(() => (id: string) => {
    return analyses.value.find((analysis) => analysis.id === id);
  });

  const feasibleAnalyses = computed(() => {
    return analyses.value.filter((analysis) => analysis.status === "feasible");
  });

  const recentAnalyses = computed(() => {
    return feasibleAnalyses.value
      .sort(
        (a, b) =>
          new Date(b.analysis_date).getTime() -
          new Date(a.analysis_date).getTime()
      )
      .slice(0, 5);
  });

  const averageScore = computed(() => {
    const feasible = feasibleAnalyses.value;
    if (feasible.length === 0) return 0;
    const sum = feasible.reduce(
      (total, analysis) => total + (analysis.overall_score || 0),
      0
    );
    return Number((sum / feasible.length).toFixed(1));
  });

  const totalAnalyses = computed(() => analyses.value.length);
  const totalFeasibleAnalyses = computed(() => feasibleAnalyses.value.length);

  const scoreDistribution = computed(() => {
    const distribution = {
      excellent: 0, // 8-10
      good: 0, // 6-8
      average: 0, // 4-6
      poor: 0, // 0-4
    };

    feasibleAnalyses.value.forEach((analysis) => {
      const score = analysis.overall_score || 0;
      if (score >= 8) distribution.excellent++;
      else if (score >= 6) distribution.good++;
      else if (score >= 4) distribution.average++;
      else distribution.poor++;
    });

    return distribution;
  });

  const bestScore = computed(() => {
    const feasible = feasibleAnalyses.value;
    if (feasible.length === 0) return 0;
    return Math.max(...feasible.map((a) => a.overall_score || 0));
  });

  const latestAnalysis = computed(() => {
    if (analyses.value.length === 0) return null;
    return analyses.value.reduce((latest, analysis) => {
      return new Date(analysis.analysis_date).getTime() >
        new Date(latest.analysis_date).getTime()
        ? analysis
        : latest;
    });
  });

  // Actions
  const setCurrentAnalysis = (analysis: Analysis | null) => {
    currentAnalysis.value = analysis;
  };

  const addAnalysis = (analysis: Analysis) => {
    analyses.value.unshift(analysis);
  };

  const setAnalyzing = (value: boolean) => {
    isAnalyzing.value = value;
  };

  const setUploadProgress = (progress: UploadProgress) => {
    uploadProgress.value = progress;
  };

  const resetUploadProgress = () => {
    uploadProgress.value = {
      loaded: 0,
      total: 0,
      percentage: 0,
    };
  };


  return {
    // State
    analyses,
    currentAnalysis,
    isAnalyzing,
    uploadProgress,
    // Getters
    getAnalysisById,
    feasibleAnalyses,
    recentAnalyses,
    averageScore,
    totalAnalyses,
    totalFeasibleAnalyses,
    scoreDistribution,
    bestScore,
    latestAnalysis,
    // Actions
    setCurrentAnalysis,
    addAnalysis,
    setAnalyzing,
    setUploadProgress,
    resetUploadProgress,
  };
});
