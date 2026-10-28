import { create } from "zustand";
import type { AIModule } from "@/types/ai";

interface AIState {
  activeRequestId: string | null;
  setActiveRequestId: (id: string | null) => void;

  isExecuting: boolean;
  setIsExecuting: (executing: boolean) => void;

  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;

  streamingContent: string;
  setStreamingContent: (content: string) => void;

  selectedProvider: string | null;
  setSelectedProvider: (provider: string | null) => void;

  selectedModel: string | null;
  setSelectedModel: (model: string | null) => void;

  selectedModule: AIModule | null;
  setSelectedModule: (module: AIModule | null) => void;

  lastError: string | null;
  setLastError: (error: string | null) => void;

  lastResponse: Record<string, unknown> | null;
  setLastResponse: (response: Record<string, unknown> | null) => void;

  requestHistory: string[];
  addRequestId: (id: string) => void;
  clearRequestHistory: () => void;

  abortController: AbortController | null;
  setAbortController: (controller: AbortController | null) => void;

  isDetailPanelOpen: boolean;
  toggleDetailPanel: () => void;
  setDetailPanelOpen: (open: boolean) => void;

  reset: () => void;
}

const initialState = {
  activeRequestId: null,
  isExecuting: false,
  isStreaming: false,
  streamingContent: "",
  selectedProvider: null,
  selectedModel: null,
  selectedModule: null,
  lastError: null,
  lastResponse: null,
  requestHistory: [],
  abortController: null,
  isDetailPanelOpen: false,
};

export const useAIStore = create<AIState>((set) => ({
  ...initialState,

  setActiveRequestId: (id) => set({ activeRequestId: id }),

  setIsExecuting: (executing) => set({ isExecuting: executing }),

  setIsStreaming: (streaming) => set({ isStreaming: streaming }),

  setStreamingContent: (content) => set({ streamingContent: content }),

  setSelectedProvider: (provider) => set({ selectedProvider: provider }),

  setSelectedModel: (model) => set({ selectedModel: model }),

  setSelectedModule: (module) => set({ selectedModule: module }),

  setLastError: (error) => set({ lastError: error }),

  setLastResponse: (response) => set({ lastResponse: response }),

  addRequestId: (id) =>
    set((state) => ({
      requestHistory: [id, ...state.requestHistory].slice(0, 50),
    })),
  clearRequestHistory: () => set({ requestHistory: [] }),

  setAbortController: (controller) => set({ abortController: controller }),

  toggleDetailPanel: () =>
    set((state) => ({ isDetailPanelOpen: !state.isDetailPanelOpen })),
  setDetailPanelOpen: (open) => set({ isDetailPanelOpen: open }),

  reset: () => set(initialState),
}));
