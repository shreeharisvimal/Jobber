import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { careerCoachApi } from "@/lib/api-client";
import { toast } from "@/stores/toast.store";

export const careerCoachKeys = {
  all: ["career-coach"] as const,
  dashboard: () => [...careerCoachKeys.all, "dashboard"] as const,
  sessions: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "sessions", params] as const,
  session: (id: string) => [...careerCoachKeys.all, "session", id] as const,
  assessments: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "assessments", params] as const,
  assessment: (id: string) => [...careerCoachKeys.all, "assessment", id] as const,
  healthScores: () => [...careerCoachKeys.all, "health-scores"] as const,
  readinessScores: () => [...careerCoachKeys.all, "readiness-scores"] as const,
  scoreHistory: (type?: string) => [...careerCoachKeys.all, "score-history", type] as const,
  recommendations: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "recommendations", params] as const,
  goals: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "goals", params] as const,
  goal: (id: string) => [...careerCoachKeys.all, "goal", id] as const,
  roadmaps: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "roadmaps", params] as const,
  roadmap: (id: string) => [...careerCoachKeys.all, "roadmap", id] as const,
  reviews: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "reviews", params] as const,
  review: (id: string) => [...careerCoachKeys.all, "review", id] as const,
  reports: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "reports", params] as const,
  report: (id: string) => [...careerCoachKeys.all, "report", id] as const,
  insights: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "insights", params] as const,
  opportunities: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "opportunities", params] as const,
  trends: () => [...careerCoachKeys.all, "trends"] as const,
  skillGaps: () => [...careerCoachKeys.all, "skill-gaps"] as const,
  risks: () => [...careerCoachKeys.all, "risks"] as const,
  alerts: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "alerts", params] as const,
  notifications: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "notifications", params] as const,
  conversations: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "conversations", params] as const,
  conversation: (id: string) => [...careerCoachKeys.all, "conversation", id] as const,
  learning: () => [...careerCoachKeys.all, "learning"] as const,
  priorities: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "priorities", params] as const,
  history: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "history", params] as const,
  actionPlans: (params?: Record<string, unknown>) => [...careerCoachKeys.all, "action-plans", params] as const,
  actionPlan: (id: string) => [...careerCoachKeys.all, "action-plan", id] as const,
  settings: () => [...careerCoachKeys.all, "settings"] as const,
};

export function useCareerDashboard() {
  return useQuery({
    queryKey: careerCoachKeys.dashboard(),
    queryFn: () => careerCoachApi.getDashboard(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerSessions(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.sessions(params),
    queryFn: () => careerCoachApi.getSessions(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerSession(id: string) {
  return useQuery({
    queryKey: careerCoachKeys.session(id),
    queryFn: () => careerCoachApi.getSession(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCareerAssessments(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.assessments(params),
    queryFn: () => careerCoachApi.getAssessments(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerAssessment(id: string) {
  return useQuery({
    queryKey: careerCoachKeys.assessment(id),
    queryFn: () => careerCoachApi.getAssessment(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCareerHealthScores() {
  return useQuery({
    queryKey: careerCoachKeys.healthScores(),
    queryFn: () => careerCoachApi.getHealthScores(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerReadinessScores() {
  return useQuery({
    queryKey: careerCoachKeys.readinessScores(),
    queryFn: () => careerCoachApi.getReadinessScores(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerScoreHistory(scoreType?: string) {
  return useQuery({
    queryKey: careerCoachKeys.scoreHistory(scoreType),
    queryFn: () => careerCoachApi.getScoreHistory(scoreType),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerRecommendations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.recommendations(params),
    queryFn: () => careerCoachApi.getRecommendations(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerGoals(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.goals(params),
    queryFn: () => careerCoachApi.getGoals(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerGoal(id: string) {
  return useQuery({
    queryKey: careerCoachKeys.goal(id),
    queryFn: () => careerCoachApi.getGoal(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCareerRoadmaps(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.roadmaps(params),
    queryFn: () => careerCoachApi.getRoadmaps(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerRoadmap(id: string) {
  return useQuery({
    queryKey: careerCoachKeys.roadmap(id),
    queryFn: () => careerCoachApi.getRoadmap(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCareerReviews(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.reviews(params),
    queryFn: () => careerCoachApi.getReviews(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerReview(id: string) {
  return useQuery({
    queryKey: careerCoachKeys.review(id),
    queryFn: () => careerCoachApi.getReview(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCareerReports(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.reports(params),
    queryFn: () => careerCoachApi.getReports(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerReport(id: string) {
  return useQuery({
    queryKey: careerCoachKeys.report(id),
    queryFn: () => careerCoachApi.getReport(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCareerInsights(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.insights(params),
    queryFn: () => careerCoachApi.getInsights(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerOpportunities(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.opportunities(params),
    queryFn: () => careerCoachApi.getOpportunities(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerTrends() {
  return useQuery({
    queryKey: careerCoachKeys.trends(),
    queryFn: () => careerCoachApi.getTrends(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerSkillGaps() {
  return useQuery({
    queryKey: careerCoachKeys.skillGaps(),
    queryFn: () => careerCoachApi.getSkillGaps(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerRisks() {
  return useQuery({
    queryKey: careerCoachKeys.risks(),
    queryFn: () => careerCoachApi.getRisks(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerAlerts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.alerts(params),
    queryFn: () => careerCoachApi.getAlerts(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerNotifications(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.notifications(params),
    queryFn: () => careerCoachApi.getNotifications(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerConversations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.conversations(params),
    queryFn: () => careerCoachApi.getConversations(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerConversation(id: string) {
  return useQuery({
    queryKey: careerCoachKeys.conversation(id),
    queryFn: () => careerCoachApi.getConversation(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCareerLearning() {
  return useQuery({
    queryKey: careerCoachKeys.learning(),
    queryFn: () => careerCoachApi.getLearning(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerPriorities(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.priorities(params),
    queryFn: () => careerCoachApi.getPriorities(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerHistory(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.history(params),
    queryFn: () => careerCoachApi.getHistory(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerActionPlans(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: careerCoachKeys.actionPlans(params),
    queryFn: () => careerCoachApi.getActionPlans(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCareerActionPlan(id: string) {
  return useQuery({
    queryKey: careerCoachKeys.actionPlan(id),
    queryFn: () => careerCoachApi.getActionPlan(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCareerSettings() {
  return useQuery({
    queryKey: careerCoachKeys.settings(),
    queryFn: () => careerCoachApi.getSettings(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCareerSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => careerCoachApi.createSession(data),
    onSuccess: () => {
      toast.success("Session created successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.sessions() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create session");
    },
  });
}

export function useDeleteCareerSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careerCoachApi.deleteSession(id),
    onSuccess: () => {
      toast.success("Session deleted successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.sessions() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete session");
    },
  });
}

export function useCreateCareerAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => careerCoachApi.createAssessment(data),
    onSuccess: () => {
      toast.success("Assessment created successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.dashboard() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create assessment");
    },
  });
}

export function useRunFullAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => careerCoachApi.runFullAssessment(),
    onSuccess: () => {
      toast.success("Full assessment started");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.assessments() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to run full assessment");
    },
  });
}

export function useGenerateRecommendations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => careerCoachApi.generateRecommendations(),
    onSuccess: () => {
      toast.success("Recommendations generated successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.recommendations() });
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.dashboard() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate recommendations");
    },
  });
}

export function useAcceptRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careerCoachApi.acceptRecommendation(id),
    onSuccess: () => {
      toast.success("Recommendation accepted");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.recommendations() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to accept recommendation");
    },
  });
}

export function useDismissRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careerCoachApi.dismissRecommendation(id),
    onSuccess: () => {
      toast.success("Recommendation dismissed");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.recommendations() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to dismiss recommendation");
    },
  });
}

export function useCompleteRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careerCoachApi.completeRecommendation(id),
    onSuccess: () => {
      toast.success("Recommendation marked as complete");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.recommendations() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to complete recommendation");
    },
  });
}

export function useCreateCareerGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => careerCoachApi.createGoal(data),
    onSuccess: () => {
      toast.success("Goal created successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.goals() });
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.dashboard() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create goal");
    },
  });
}

export function useUpdateCareerGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => careerCoachApi.updateGoal({ id, data }),
    onSuccess: (_, variables) => {
      toast.success("Goal updated successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.goal(variables.id) });
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.goals() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update goal");
    },
  });
}

export function useDeleteCareerGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careerCoachApi.deleteGoal(id),
    onSuccess: () => {
      toast.success("Goal deleted successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.goals() });
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.dashboard() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete goal");
    },
  });
}

export function useCompleteMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, milestoneId }: { goalId: string; milestoneId: string }) =>
      careerCoachApi.completeMilestone({ goalId, milestoneId }),
    onSuccess: (_, variables) => {
      toast.success("Milestone completed");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.goal(variables.goalId) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to complete milestone");
    },
  });
}

export function useCheckGoalDeadlines() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => careerCoachApi.checkGoalDeadlines(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.goals() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to check goal deadlines");
    },
  });
}

export function useGenerateRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => careerCoachApi.generateRoadmap(data),
    onSuccess: () => {
      toast.success("Roadmap generated successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.roadmaps() });
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.dashboard() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate roadmap");
    },
  });
}

export function useUpdateRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => careerCoachApi.updateRoadmap({ id, data }),
    onSuccess: (_, variables) => {
      toast.success("Roadmap updated successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.roadmap(variables.id) });
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.roadmaps() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update roadmap");
    },
  });
}

export function useDeleteRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careerCoachApi.deleteRoadmap(id),
    onSuccess: () => {
      toast.success("Roadmap deleted successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.roadmaps() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete roadmap");
    },
  });
}

export function useGenerateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => careerCoachApi.generateReview(data),
    onSuccess: () => {
      toast.success("Review generated successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.reviews() });
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.dashboard() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate review");
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => careerCoachApi.updateReview({ id, data }),
    onSuccess: (_, variables) => {
      toast.success("Review updated successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.review(variables.id) });
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.reviews() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update review");
    },
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => careerCoachApi.generateReport(data),
    onSuccess: () => {
      toast.success("Report generated successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.reports() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate report");
    },
  });
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careerCoachApi.markAlertRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.alerts() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark alert as read");
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careerCoachApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.notifications() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark notification as read");
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => careerCoachApi.markAllNotificationsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.notifications() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark all notifications as read");
    },
  });
}

export function useCreateCareerConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => careerCoachApi.createConversation(data),
    onSuccess: () => {
      toast.success("Conversation started");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.conversations() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create conversation");
    },
  });
}

export function useSendCareerMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      careerCoachApi.sendMessage({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.conversation(variables.id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send message");
    },
  });
}

export function useCreateCareerActionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => careerCoachApi.createActionPlan(data),
    onSuccess: () => {
      toast.success("Action plan created successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.actionPlans() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create action plan");
    },
  });
}

export function useUpdateCareerActionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      careerCoachApi.updateActionPlan({ id, data }),
    onSuccess: (_, variables) => {
      toast.success("Action plan updated successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.actionPlan(variables.id) });
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.actionPlans() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update action plan");
    },
  });
}

export function useDeleteCareerActionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careerCoachApi.deleteActionPlan(id),
    onSuccess: () => {
      toast.success("Action plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.actionPlans() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete action plan");
    },
  });
}

export function useUpdateCareerSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => careerCoachApi.updateSettings(data),
    onSuccess: () => {
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.settings() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update settings");
    },
  });
}

export function useCreateCareerPriority() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => careerCoachApi.createPriority(data),
    onSuccess: () => {
      toast.success("Priority created successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.priorities() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create priority");
    },
  });
}

export function useGenerateDigest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => careerCoachApi.generateDigest(),
    onSuccess: () => {
      toast.success("Digest generated successfully");
      queryClient.invalidateQueries({ queryKey: careerCoachKeys.dashboard() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate digest");
    },
  });
}
