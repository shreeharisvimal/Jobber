import { create } from "zustand";
import type {
  JobAnalysis,
  JobScore,
  JobGap,
  JobRecommendation,
  AnalysisStatus,
} from "@/types/job";

interface JobAnalysisState {
  activeJobId: string | null;
  setActiveJobId: (id: string | null) => void;

  analyses: JobAnalysis[];
  setAnalyses: (analyses: JobAnalysis[]) => void;
  addAnalysis: (analysis: JobAnalysis) => void;
  updateAnalysis: (id: string, analysis: Partial<JobAnalysis>) => void;

  activeAnalysis: JobAnalysis | null;
  setActiveAnalysis: (analysis: JobAnalysis | null) => void;

  scores: JobScore[];
  setScores: (scores: JobScore[]) => void;

  gaps: JobGap[];
  setGaps: (gaps: JobGap[]) => void;

  recommendations: JobRecommendation[];
  setRecommendations: (recommendations: JobRecommendation[]) => void;
  dismissRecommendation: (id: string) => void;
  markRecommendationRead: (id: string) => void;

  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;

  analysisStatus: AnalysisStatus | null;
  setAnalysisStatus: (status: AnalysisStatus | null) => void;

  activeAnalysisType: string;
  setActiveAnalysisType: (type: string) => void;

  showDismissed: boolean;
  toggleShowDismissed: () => void;

  overallScore: number | null;
  setOverallScore: (score: number | null) => void;

  scoreBreakdown: Record<string, number>;
  setScoreBreakdown: (breakdown: Record<string, number>) => void;

  reset: () => void;
}

const initialState = {
  activeJobId: null,
  analyses: [],
  activeAnalysis: null,
  scores: [],
  gaps: [],
  recommendations: [],
  isAnalyzing: false,
  analysisStatus: null,
  activeAnalysisType: "match",
  showDismissed: false,
  overallScore: null,
  scoreBreakdown: {},
};

export const useJobAnalysisStore = create<JobAnalysisState>((set) => ({
  ...initialState,

  setActiveJobId: (id) => set({ activeJobId: id }),

  setAnalyses: (analyses) => set({ analyses }),
  addAnalysis: (analysis) =>
    set((state) => ({
      analyses: [analysis, ...state.analyses],
    })),
  updateAnalysis: (id, update) =>
    set((state) => ({
      analyses: state.analyses.map((a) =>
        a.id === id ? { ...a, ...update } : a
      ),
    })),

  setActiveAnalysis: (analysis) => set({ activeAnalysis: analysis }),

  setScores: (scores) => set({ scores }),

  setGaps: (gaps) => set({ gaps }),

  setRecommendations: (recommendations) => set({ recommendations }),
  dismissRecommendation: (id) =>
    set((state) => ({
      recommendations: state.recommendations.map((r) =>
        r.id === id ? { ...r, is_dismissed: true } : r
      ),
    })),
  markRecommendationRead: (id) =>
    set((state) => ({
      recommendations: state.recommendations.map((r) =>
        r.id === id ? { ...r, is_read: true } : r
      ),
    })),

  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setAnalysisStatus: (status) => set({ analysisStatus: status }),
  setActiveAnalysisType: (type) => set({ activeAnalysisType: type }),
  toggleShowDismissed: () =>
    set((state) => ({ showDismissed: !state.showDismissed })),

  setOverallScore: (score) => set({ overallScore: score }),
  setScoreBreakdown: (breakdown) => set({ scoreBreakdown: breakdown }),

  reset: () => set(initialState),
}));
