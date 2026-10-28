import { create } from "zustand";
import type { AIModule, AIMessageRole } from "@/types/ai";

interface AIConversationState {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  activeModule: AIModule | null;
  setActiveModule: (module: AIModule | null) => void;

  messages: Array<{
    id: string;
    role: AIMessageRole;
    content: string;
    tokens: number;
    created_at: string;
  }>;
  addMessage: (message: {
    id: string;
    role: AIMessageRole;
    content: string;
    tokens: number;
    created_at: string;
  }) => void;
  setMessages: (
    messages: Array<{
      id: string;
      role: AIMessageRole;
      content: string;
      tokens: number;
      created_at: string;
    }>
  ) => void;
  clearMessages: () => void;

  isStreamingMessage: boolean;
  setIsStreamingMessage: (streaming: boolean) => void;

  streamingMessageId: string | null;
  setStreamingMessageId: (id: string | null) => void;

  streamingContent: string;
  appendStreamingContent: (chunk: string) => void;
  setStreamingContent: (content: string) => void;

  context: Record<string, unknown>;
  setContext: (context: Record<string, unknown>) => void;
  updateContext: (partial: Record<string, unknown>) => void;

  title: string | null;
  setTitle: (title: string | null) => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  totalTokens: number;
  addTokens: (tokens: number) => void;
  resetTokens: () => void;

  totalCost: number;
  addCost: (cost: number) => void;
  resetCost: () => void;

  reset: () => void;
}

const initialState = {
  activeConversationId: null,
  activeModule: null,
  messages: [],
  isStreamingMessage: false,
  streamingMessageId: null,
  streamingContent: "",
  context: {},
  title: null,
  isSidebarOpen: true,
  totalTokens: 0,
  totalCost: 0,
};

export const useAIConversationStore = create<AIConversationState>((set) => ({
  ...initialState,

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  setActiveModule: (module) => set({ activeModule: module }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setMessages: (messages) => set({ messages }),
  clearMessages: () => set({ messages: [] }),

  setIsStreamingMessage: (streaming) => set({ isStreamingMessage: streaming }),

  setStreamingMessageId: (id) => set({ streamingMessageId: id }),

  appendStreamingContent: (chunk) =>
    set((state) => ({
      streamingContent: state.streamingContent + chunk,
    })),
  setStreamingContent: (content) => set({ streamingContent: content }),

  setContext: (context) => set({ context }),
  updateContext: (partial) =>
    set((state) => ({
      context: { ...state.context, ...partial },
    })),

  setTitle: (title) => set({ title }),

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  addTokens: (tokens) =>
    set((state) => ({ totalTokens: state.totalTokens + tokens })),
  resetTokens: () => set({ totalTokens: 0 }),

  addCost: (cost) =>
    set((state) => ({ totalCost: state.totalCost + cost })),
  resetCost: () => set({ totalCost: 0 }),

  reset: () => set(initialState),
}));
