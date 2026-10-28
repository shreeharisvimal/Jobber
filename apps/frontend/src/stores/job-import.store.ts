import { create } from "zustand";
import type { Job, JobImportRecord, JobImportRequest } from "@/types/job";

type ImportType = JobImportRequest["import_type"];
type ImportStatus = "idle" | "uploading" | "processing" | "completed" | "failed";

interface JobImportState {
  importType: ImportType | null;
  setImportType: (type: ImportType) => void;

  status: ImportStatus;
  setStatus: (status: ImportStatus) => void;

  sourceText: string;
  setSourceText: (text: string) => void;

  sourceUrl: string;
  setSourceUrl: (url: string) => void;

  jsonData: Record<string, unknown> | null;
  setJsonData: (data: Record<string, unknown> | null) => void;

  source: string;
  setSource: (source: string) => void;

  fileName: string | null;
  setFileName: (name: string | null) => void;

  activeRecordId: string | null;
  setActiveRecordId: (id: string | null) => void;

  activeRecord: JobImportRecord | null;
  setActiveRecord: (record: JobImportRecord | null) => void;

  importedJobs: Job[];
  addImportedJob: (job: Job) => void;
  setImportedJobs: (jobs: Job[]) => void;

  jobsFound: number;
  setJobsFound: (count: number) => void;

  jobsImported: number;
  setJobsImported: (count: number) => void;

  errors: string[];
  addError: (error: string) => void;
  clearErrors: () => void;

  conflicts: Record<string, unknown> | null;
  setConflicts: (conflicts: Record<string, unknown> | null) => void;

  toImportRequest: () => JobImportRequest;
  reset: () => void;
}

const initialState = {
  importType: null,
  status: "idle" as const,
  sourceText: "",
  sourceUrl: "",
  jsonData: null,
  source: "",
  fileName: null,
  activeRecordId: null,
  activeRecord: null,
  importedJobs: [],
  jobsFound: 0,
  jobsImported: 0,
  errors: [],
  conflicts: null,
};

export const useJobImportStore = create<JobImportState>((set, get) => ({
  ...initialState,

  setImportType: (type) => set({ importType: type }),
  setStatus: (status) => set({ status }),
  setSourceText: (text) => set({ sourceText: text }),
  setSourceUrl: (url) => set({ sourceUrl: url }),
  setJsonData: (data) => set({ jsonData: data }),
  setSource: (source) => set({ source }),
  setFileName: (name) => set({ fileName: name }),
  setActiveRecordId: (id) => set({ activeRecordId: id }),
  setActiveRecord: (record) => set({ activeRecord: record, activeRecordId: record?.id ?? null }),
  addImportedJob: (job) =>
    set((state) => ({
      importedJobs: [...state.importedJobs, job],
      jobsImported: state.jobsImported + 1,
    })),
  setImportedJobs: (jobs) => set({ importedJobs: jobs }),
  setJobsFound: (count) => set({ jobsFound: count }),
  setJobsImported: (count) => set({ jobsImported: count }),
  addError: (error) =>
    set((state) => ({ errors: [...state.errors, error] })),
  clearErrors: () => set({ errors: [] }),
  setConflicts: (conflicts) => set({ conflicts }),

  toImportRequest: () => {
    const state = get();
    return {
      import_type: state.importType!,
      source_text: state.sourceText || undefined,
      url: state.sourceUrl || undefined,
      json_data: state.jsonData ?? undefined,
      source: state.source || undefined,
    };
  },

  reset: () => set(initialState),
}));
