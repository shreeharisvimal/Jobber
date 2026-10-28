import { create } from "zustand";
import type {
  ATSAnalysis,
  ATSAnalysisDetail,
  ATSAnalysisStatus,
  ATSAnalysisType,
  ATSConfiguration,
  ATSRuleSet,
  ATSRule,
  ATSRuleCategory,
  ATSVersion,
  ATSComparison,
  ATSReport,
  ATSScan,
  ATSScore,
  ATSKeywordMatch,
  ATSKeywordGap,
  ATSSkillMatch,
  ATSSkillGap,
  ATSRecommendation,
  ATSGrade,
} from "@/types/ats";

interface ATSState {
  activeAnalysisId: string | null;
  setActiveAnalysisId: (id: string | null) => void;

  analyses: ATSAnalysis[];
  setAnalyses: (analyses: ATSAnalysis[]) => void;
  addAnalysis: (analysis: ATSAnalysis) => void;
  updateAnalysis: (id: string, analysis: Partial<ATSAnalysis>) => void;

  activeAnalysis: ATSAnalysisDetail | null;
  setActiveAnalysis: (analysis: ATSAnalysisDetail | null) => void;

  scores: ATSScore[];
  setScores: (scores: ATSScore[]) => void;

  keywordMatches: ATSKeywordMatch[];
  setKeywordMatches: (matches: ATSKeywordMatch[]) => void;

  keywordGaps: ATSKeywordGap[];
  setKeywordGaps: (gaps: ATSKeywordGap[]) => void;

  skillMatches: ATSSkillMatch[];
  setSkillMatches: (matches: ATSSkillMatch[]) => void;

  skillGaps: ATSSkillGap[];
  setSkillGaps: (gaps: ATSSkillGap[]) => void;

  recommendations: ATSRecommendation[];
  setRecommendations: (recommendations: ATSRecommendation[]) => void;
  dismissRecommendation: (id: string) => void;
  markRecommendationRead: (id: string) => void;

  configurations: ATSConfiguration[];
  setConfigurations: (configs: ATSConfiguration[]) => void;

  activeConfiguration: ATSConfiguration | null;
  setActiveConfiguration: (config: ATSConfiguration | null) => void;

  ruleSets: ATSRuleSet[];
  setRuleSets: (sets: ATSRuleSet[]) => void;

  rules: ATSRule[];
  setRules: (rules: ATSRule[]) => void;

  ruleCategories: ATSRuleCategory[];
  setRuleCategories: (categories: ATSRuleCategory[]) => void;

  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;

  analysisStatus: ATSAnalysisStatus | null;
  setAnalysisStatus: (status: ATSAnalysisStatus | null) => void;

  activeAnalysisType: ATSAnalysisType;
  setActiveAnalysisType: (type: ATSAnalysisType) => void;

  overallScore: number | null;
  setOverallScore: (score: number | null) => void;

  grade: ATSGrade | null;
  setGrade: (grade: ATSGrade | null) => void;

  versions: ATSVersion[];
  setVersions: (versions: ATSVersion[]) => void;

  comparisons: ATSComparison[];
  setComparisons: (comparisons: ATSComparison[]) => void;

  reports: ATSReport[];
  setReports: (reports: ATSReport[]) => void;

  scans: ATSScan[];
  setScans: (scans: ATSScan[]) => void;

  filters: {
    status: ATSAnalysisStatus | null;
    type: ATSAnalysisType | null;
    grade: ATSGrade | null;
    dateFrom: string | null;
    dateTo: string | null;
    search: string;
  };
  setFilters: (filters: Partial<ATSState["filters"]>) => void;
  resetFilters: () => void;

  reset: () => void;
}

const initialFilters = {
  status: null,
  type: null,
  grade: null,
  dateFrom: null,
  dateTo: null,
  search: "",
};

const initialState = {
  activeAnalysisId: null,
  analyses: [],
  activeAnalysis: null,
  scores: [],
  keywordMatches: [],
  keywordGaps: [],
  skillMatches: [],
  skillGaps: [],
  recommendations: [],
  configurations: [],
  activeConfiguration: null,
  ruleSets: [],
  rules: [],
  ruleCategories: [],
  isAnalyzing: false,
  analysisStatus: null,
  activeAnalysisType: "comprehensive" as ATSAnalysisType,
  overallScore: null,
  grade: null,
  versions: [],
  comparisons: [],
  reports: [],
  scans: [],
  filters: { ...initialFilters },
};

export const useATSStore = create<ATSState>((set) => ({
  ...initialState,

  setActiveAnalysisId: (id) => set({ activeAnalysisId: id }),

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

  setKeywordMatches: (matches) => set({ keywordMatches: matches }),
  setKeywordGaps: (gaps) => set({ keywordGaps: gaps }),

  setSkillMatches: (matches) => set({ skillMatches: matches }),
  setSkillGaps: (gaps) => set({ skillGaps: gaps }),

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

  setConfigurations: (configs) => set({ configurations: configs }),
  setActiveConfiguration: (config) => set({ activeConfiguration: config }),

  setRuleSets: (sets) => set({ ruleSets: sets }),
  setRules: (rules) => set({ rules }),
  setRuleCategories: (categories) => set({ ruleCategories: categories }),

  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setAnalysisStatus: (status) => set({ analysisStatus: status }),
  setActiveAnalysisType: (type) => set({ activeAnalysisType: type }),

  setOverallScore: (score) => set({ overallScore: score }),
  setGrade: (grade) => set({ grade }),

  setVersions: (versions) => set({ versions }),
  setComparisons: (comparisons) => set({ comparisons }),
  setReports: (reports) => set({ reports }),
  setScans: (scans) => set({ scans }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: { ...initialFilters } }),

  reset: () => set(initialState),
}));
