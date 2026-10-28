import { Outlet, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestRoute } from "./components/auth/GuestRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { EmailSentPage } from "./pages/auth/EmailSentPage";
import { AccountLockedPage } from "./pages/auth/AccountLockedPage";
import { OAuthCallbackPage } from "./pages/auth/OAuthCallbackPage";
import { UnauthorizedPage } from "./pages/auth/UnauthorizedPage";
import { ForbiddenPage } from "./pages/auth/ForbiddenPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfileSettingsPage } from "./pages/settings/ProfileSettingsPage";
import { SessionsPage } from "./pages/settings/SessionsPage";
import { SecurityPage } from "./pages/settings/SecurityPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfileEditorLayout } from "./pages/profile/ProfileEditorLayout";
import { ProfileOverviewPage } from "./pages/profile/ProfileOverviewPage";
import { WorkExperiencePage } from "./pages/profile/WorkExperiencePage";
import { EducationPage } from "./pages/profile/EducationPage";
import { SkillsPage } from "./pages/profile/SkillsPage";
import { CertificationsPage } from "./pages/profile/CertificationsPage";
import { ProjectsPage } from "./pages/profile/ProjectsPage";
import { LanguagesPage } from "./pages/profile/LanguagesPage";
import { VolunteerExperiencePage } from "./pages/profile/VolunteerExperiencePage";
import { PublicationsPage } from "./pages/profile/PublicationsPage";
import { PatentsPage } from "./pages/profile/PatentsPage";
import { AwardsPage } from "./pages/profile/AwardsPage";
import { RecommendationsPage } from "./pages/profile/RecommendationsPage";
import { CareerGoalsPage } from "./pages/profile/CareerGoalsPage";
import { CustomSectionsPage } from "./pages/profile/CustomSectionsPage";
import { ImportExportPage } from "./pages/profile/ImportExportPage";
import { ResumeDashboardPage } from "./pages/resumes/ResumeDashboardPage";
import { ResumeEditorPage } from "./pages/resumes/ResumeEditorPage";
import { ResumeSectionsPage } from "./pages/resumes/ResumeSectionsPage";
import { ResumeVersionsPage } from "./pages/resumes/ResumeVersionsPage";
import { ResumeTemplatesPage } from "./pages/resumes/ResumeTemplatesPage";
import { ResumeSettingsPage } from "./pages/resumes/ResumeSettingsPage";
import { ResumeAnalyticsPage } from "./pages/resumes/ResumeAnalyticsPage";
import { ResumeHistoryPage } from "./pages/resumes/ResumeHistoryPage";
import { ResumeCollectionsPage } from "./pages/resumes/ResumeCollectionsPage";
import { AIDashboardPage } from "./pages/ai/AIDashboardPage";
import { PromptLibraryPage } from "./pages/ai/PromptLibraryPage";
import { ExecutionHistoryPage } from "./pages/ai/ExecutionHistoryPage";
import { UsageAnalyticsPage } from "./pages/ai/UsageAnalyticsPage";
import { ProviderSettingsPage } from "./pages/ai/ProviderSettingsPage";
import { ConversationExplorerPage } from "./pages/ai/ConversationExplorerPage";
import { AIConfigurationPage } from "./pages/ai/AIConfigurationPage";
import { JobDashboardPage } from "./pages/jobs/JobDashboardPage";
import { ImportJobPage } from "./pages/jobs/ImportJobPage";
import { JobSearchPage } from "./pages/jobs/JobSearchPage";
import { SavedJobsPage } from "./pages/jobs/SavedJobsPage";
import { FavoritesPage } from "./pages/jobs/FavoritesPage";
import { JobCollectionsPage } from "./pages/jobs/JobCollectionsPage";
import { JobDetailsPage } from "./pages/jobs/JobDetailsPage";
import { JobAnalysisPage } from "./pages/jobs/JobAnalysisPage";
import { JobVersionsPage } from "./pages/jobs/JobVersionsPage";
import { ATSDashboardPage } from "./pages/ats/ATSDashboardPage";
import { ATSAnalysesPage } from "./pages/ats/ATSAnalysesPage";
import { ATSAnalysisResultsPage } from "./pages/ats/ATSAnalysisResultsPage";
import { ATSRuleLibraryPage } from "./pages/ats/ATSRuleLibraryPage";
import { ATSReportsPage } from "./pages/ats/ATSReportsPage";
import { ATSHistoryPage } from "./pages/ats/ATSHistoryPage";
import { ATSConfigurationPage } from "./pages/ats/ATSConfigurationPage";
import { OptimizationDashboardPage } from "./pages/optimization/OptimizationDashboardPage";
import { OptimizationSessionsPage } from "./pages/optimization/OptimizationSessionsPage";
import { OptimizationSessionPage } from "./pages/optimization/OptimizationSessionPage";
import { OptimizationRulesPage } from "./pages/optimization/OptimizationRulesPage";
import { OptimizationHistoryPage } from "./pages/optimization/OptimizationHistoryPage";
import { OptimizationAppliedPage } from "./pages/optimization/OptimizationAppliedPage";
import { OptimizationSettingsPage } from "./pages/optimization/OptimizationSettingsPage";
import InterviewDashboardPage from "./pages/interview/InterviewDashboardPage";
import InterviewListPage from "./pages/interview/InterviewListPage";
import InterviewDetailPage from "./pages/interview/InterviewDetailPage";
import InterviewCreatePage from "./pages/interview/InterviewCreatePage";
import InterviewTemplatesPage from "./pages/interview/InterviewTemplatesPage";
import InterviewQuestionBankPage from "./pages/interview/InterviewQuestionBankPage";
import InterviewAnalyticsPage from "./pages/interview/InterviewAnalyticsPage";
import InterviewSettingsPage from "./pages/interview/InterviewSettingsPage";
import InterviewCollectionsPage from "./pages/interview/InterviewCollectionsPage";
import CRMDashboardPage from "./pages/crm/CRMDashboardPage";
import RecruiterListPage from "./pages/crm/RecruiterListPage";
import RecruiterDetailPage from "./pages/crm/RecruiterDetailPage";
import ApplicationListPage from "./pages/crm/ApplicationListPage";
import ApplicationDetailPage from "./pages/crm/ApplicationDetailPage";
import ApplicationCreatePage from "./pages/crm/ApplicationCreatePage";
import ReferralListPage from "./pages/crm/ReferralListPage";
import ReferralDetailPage from "./pages/crm/ReferralDetailPage";
import NetworkingDashboardPage from "./pages/crm/NetworkingDashboardPage";
import NetworkingContactListPage from "./pages/crm/NetworkingContactListPage";
import NetworkingContactDetailPage from "./pages/crm/NetworkingContactDetailPage";
import CRMSettingsPage from "./pages/crm/CRMSettingsPage";
import EmailDashboardPage from "./pages/email/EmailDashboardPage";
import InboxPage from "./pages/email/InboxPage";
import EmailDraftsPage from "./pages/email/EmailDraftsPage";
import EmailTemplatesPage from "./pages/email/EmailTemplatesPage";
import EmailTemplateDetailPage from "./pages/email/EmailTemplateDetailPage";
import EmailCampaignsPage from "./pages/email/EmailCampaignsPage";
import EmailCampaignDetailPage from "./pages/email/EmailCampaignDetailPage";
import EmailSequencesPage from "./pages/email/EmailSequencesPage";
import EmailSequenceDetailPage from "./pages/email/EmailSequenceDetailPage";
import EmailThreadsPage from "./pages/email/EmailThreadsPage";
import EmailAnalyticsPage from "./pages/email/EmailAnalyticsPage";
import EmailSettingsPage from "./pages/email/EmailSettingsPage";
import PortfolioDashboardPage from "./pages/portfolio/PortfolioDashboardPage";
import PortfolioDetailPage from "./pages/portfolio/PortfolioDetailPage";
import PortfolioEditorPage from "./pages/portfolio/PortfolioEditorPage";
import PortfolioBuilderPage from "./pages/portfolio/PortfolioBuilderPage";
import PortfolioPreviewPage from "./pages/portfolio/PortfolioPreviewPage";
import PortfolioTemplatesPage from "./pages/portfolio/PortfolioTemplatesPage";
import PortfolioThemesPage from "./pages/portfolio/PortfolioThemesPage";
import PortfolioAnalyticsPage from "./pages/portfolio/PortfolioAnalyticsPage";
import PortfolioVersionsPage from "./pages/portfolio/PortfolioVersionsPage";
import PortfolioSettingsPage from "./pages/portfolio/PortfolioSettingsPage";
import PortfolioProjectsPage from "./pages/portfolio/PortfolioProjectsPage";
import PortfolioSharesPage from "./pages/portfolio/PortfolioSharesPage";
import PortfolioSEOPage from "./pages/portfolio/PortfolioSEOPage";
import PortfolioDeployPage from "./pages/portfolio/PortfolioDeployPage";
import { CareerCoachDashboardPage } from "./pages/career-coach/CareerCoachDashboardPage";
import { CareerCoachAssessmentsPage } from "./pages/career-coach/CareerCoachAssessmentsPage";
import { CareerCoachRecommendationsPage } from "./pages/career-coach/CareerCoachRecommendationsPage";
import { CareerCoachGoalsPage } from "./pages/career-coach/CareerCoachGoalsPage";
import { CareerCoachRoadmapsPage } from "./pages/career-coach/CareerCoachRoadmapsPage";
import { CareerCoachInsightsPage } from "./pages/career-coach/CareerCoachInsightsPage";
import { CareerCoachSettingsPage } from "./pages/career-coach/CareerCoachSettingsPage";

function ProfileLayout() {
  return (
    <ProfileEditorLayout>
      <Outlet />
    </ProfileEditorLayout>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          </GuestRoute>
        }
      />

      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/email-sent" element={<EmailSentPage />} />
      <Route path="/account-locked" element={<AccountLockedPage />} />
      <Route path="/auth/callback/:provider" element={<OAuthCallbackPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings/profile" element={<ProfileSettingsPage />} />
        <Route path="/settings/sessions" element={<SessionsPage />} />
        <Route path="/settings/security" element={<SecurityPage />} />

        <Route element={<ProfileLayout />}>
          <Route path="/profile" element={<ProfileOverviewPage />} />
          <Route path="/profile/experience" element={<WorkExperiencePage />} />
          <Route path="/profile/education" element={<EducationPage />} />
          <Route path="/profile/skills" element={<SkillsPage />} />
          <Route path="/profile/certifications" element={<CertificationsPage />} />
          <Route path="/profile/projects" element={<ProjectsPage />} />
          <Route path="/profile/languages" element={<LanguagesPage />} />
          <Route path="/profile/volunteer" element={<VolunteerExperiencePage />} />
          <Route path="/profile/publications" element={<PublicationsPage />} />
          <Route path="/profile/patents" element={<PatentsPage />} />
          <Route path="/profile/awards" element={<AwardsPage />} />
          <Route path="/profile/recommendations" element={<RecommendationsPage />} />
          <Route path="/profile/goals" element={<CareerGoalsPage />} />
          <Route path="/profile/custom" element={<CustomSectionsPage />} />
          <Route path="/profile/import-export" element={<ImportExportPage />} />
        </Route>

        <Route path="/resumes" element={<ResumeDashboardPage />} />
        <Route path="/resumes/new" element={<ResumeEditorPage />} />
        <Route path="/resumes/templates" element={<ResumeTemplatesPage />} />
        <Route path="/resumes/collections" element={<ResumeCollectionsPage />} />
        <Route path="/resumes/:id" element={<ResumeEditorPage />} />
        <Route path="/resumes/:id/sections" element={<ResumeSectionsPage />} />
        <Route path="/resumes/:id/versions" element={<ResumeVersionsPage />} />
        <Route path="/resumes/:id/analytics" element={<ResumeAnalyticsPage />} />
        <Route path="/resumes/:id/history" element={<ResumeHistoryPage />} />
        <Route path="/resumes/:id/settings" element={<ResumeSettingsPage />} />

        <Route path="/ai" element={<AIDashboardPage />} />
        <Route path="/ai/prompts" element={<PromptLibraryPage />} />
        <Route path="/ai/history" element={<ExecutionHistoryPage />} />
        <Route path="/ai/usage" element={<UsageAnalyticsPage />} />
        <Route path="/ai/providers" element={<ProviderSettingsPage />} />
        <Route path="/ai/conversations" element={<ConversationExplorerPage />} />
        <Route path="/ai/settings" element={<AIConfigurationPage />} />

        <Route path="/jobs" element={<JobDashboardPage />} />
        <Route path="/jobs/import" element={<ImportJobPage />} />
        <Route path="/jobs/search" element={<JobSearchPage />} />
        <Route path="/jobs/saved" element={<SavedJobsPage />} />
        <Route path="/jobs/favorites" element={<FavoritesPage />} />
        <Route path="/jobs/collections" element={<JobCollectionsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/jobs/:id/analysis" element={<JobAnalysisPage />} />
        <Route path="/jobs/:id/versions" element={<JobVersionsPage />} />

        <Route path="/ats" element={<ATSDashboardPage />} />
        <Route path="/ats/analyses" element={<ATSAnalysesPage />} />
        <Route path="/ats/analyses/:id" element={<ATSAnalysisResultsPage />} />
        <Route path="/ats/rules" element={<ATSRuleLibraryPage />} />
        <Route path="/ats/reports" element={<ATSReportsPage />} />
        <Route path="/ats/history" element={<ATSHistoryPage />} />
        <Route path="/ats/configuration" element={<ATSConfigurationPage />} />

        <Route path="/optimization" element={<OptimizationDashboardPage />} />
        <Route path="/optimization/sessions" element={<OptimizationSessionsPage />} />
        <Route path="/optimization/sessions/:id" element={<OptimizationSessionPage />} />
        <Route path="/optimization/rules" element={<OptimizationRulesPage />} />
        <Route path="/optimization/history" element={<OptimizationHistoryPage />} />
        <Route path="/optimization/applied" element={<OptimizationAppliedPage />} />
        <Route path="/optimization/settings" element={<OptimizationSettingsPage />} />

        <Route path="/interviews" element={<InterviewDashboardPage />} />
        <Route path="/interviews/list" element={<InterviewListPage />} />
        <Route path="/interviews/new" element={<InterviewCreatePage />} />
        <Route path="/interviews/:id" element={<InterviewDetailPage />} />
        <Route path="/interviews/templates" element={<InterviewTemplatesPage />} />
        <Route path="/interviews/question-bank" element={<InterviewQuestionBankPage />} />
        <Route path="/interviews/analytics" element={<InterviewAnalyticsPage />} />
        <Route path="/interviews/settings" element={<InterviewSettingsPage />} />
        <Route path="/interviews/collections" element={<InterviewCollectionsPage />} />

        <Route path="/crm" element={<CRMDashboardPage />} />
        <Route path="/crm/recruiters" element={<RecruiterListPage />} />
        <Route path="/crm/recruiters/:id" element={<RecruiterDetailPage />} />
        <Route path="/crm/applications" element={<ApplicationListPage />} />
        <Route path="/crm/applications/new" element={<ApplicationCreatePage />} />
        <Route path="/crm/applications/:id" element={<ApplicationDetailPage />} />
        <Route path="/crm/referrals" element={<ReferralListPage />} />
        <Route path="/crm/referrals/:id" element={<ReferralDetailPage />} />
        <Route path="/crm/networking" element={<NetworkingDashboardPage />} />
        <Route path="/crm/networking/contacts" element={<NetworkingContactListPage />} />
        <Route path="/crm/networking/contacts/:id" element={<NetworkingContactDetailPage />} />
        <Route path="/crm/settings" element={<CRMSettingsPage />} />

        <Route path="/email" element={<EmailDashboardPage />} />
        <Route path="/email/inbox" element={<InboxPage />} />
        <Route path="/email/drafts" element={<EmailDraftsPage />} />
        <Route path="/email/templates" element={<EmailTemplatesPage />} />
        <Route path="/email/templates/:id" element={<EmailTemplateDetailPage />} />
        <Route path="/email/campaigns" element={<EmailCampaignsPage />} />
        <Route path="/email/campaigns/:id" element={<EmailCampaignDetailPage />} />
        <Route path="/email/sequences" element={<EmailSequencesPage />} />
        <Route path="/email/sequences/:id" element={<EmailSequenceDetailPage />} />
        <Route path="/email/threads" element={<EmailThreadsPage />} />
        <Route path="/email/analytics" element={<EmailAnalyticsPage />} />
        <Route path="/email/settings" element={<EmailSettingsPage />} />

        <Route path="/portfolio" element={<PortfolioDashboardPage />} />
        <Route path="/portfolio/new" element={<PortfolioEditorPage />} />
        <Route path="/portfolio/templates" element={<PortfolioTemplatesPage />} />
        <Route path="/portfolio/themes" element={<PortfolioThemesPage />} />
        <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
        <Route path="/portfolio/:id/edit" element={<PortfolioEditorPage />} />
        <Route path="/portfolio/:id/builder" element={<PortfolioBuilderPage />} />
        <Route path="/portfolio/:id/preview" element={<PortfolioPreviewPage />} />
        <Route path="/portfolio/:id/analytics" element={<PortfolioAnalyticsPage />} />
        <Route path="/portfolio/:id/versions" element={<PortfolioVersionsPage />} />
        <Route path="/portfolio/:id/settings" element={<PortfolioSettingsPage />} />
        <Route path="/portfolio/:id/projects" element={<PortfolioProjectsPage />} />
        <Route path="/portfolio/:id/shares" element={<PortfolioSharesPage />} />
        <Route path="/portfolio/:id/seo" element={<PortfolioSEOPage />} />
        <Route path="/portfolio/:id/deploy" element={<PortfolioDeployPage />} />

        <Route path="/career-coach" element={<CareerCoachDashboardPage />} />
        <Route path="/career-coach/assessments" element={<CareerCoachAssessmentsPage />} />
        <Route path="/career-coach/recommendations" element={<CareerCoachRecommendationsPage />} />
        <Route path="/career-coach/goals" element={<CareerCoachGoalsPage />} />
        <Route path="/career-coach/roadmaps" element={<CareerCoachRoadmapsPage />} />
        <Route path="/career-coach/insights" element={<CareerCoachInsightsPage />} />
        <Route path="/career-coach/settings" element={<CareerCoachSettingsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
