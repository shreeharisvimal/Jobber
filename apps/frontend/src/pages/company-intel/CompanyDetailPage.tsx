import { type FC, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Building2,
  Globe,
  MapPin,
  Calendar,
  Users,
  Star,
  MessageSquare,
  Briefcase,
  DollarSign,
  Heart,
  TrendingUp,
  Newspaper,
  Coins,
  UserCheck,
  Swords,
  Brain,
  Bookmark,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useCompanyDetail,
  useCompanyReviews,
  useCompanyInterviews,
  useCompanySalaries,
  useBookmarkCompany,
  useUnbookmarkCompany,
  useFollowCompany,
  useUnfollowCompany,
} from "@/hooks/useCompanyIntel";
import type { CompanyDetail, CompanyReview, CompanyInterview, CompanySalary } from "@/types/company-intel";

function ScoreBar({ label, score }: { label: string; score: number | null }) {
  const value = score ?? 0;
  const variant = value >= 80 ? "success" : value >= 60 ? "default" : value >= 40 ? "warning" : "danger";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score !== null ? `${score}/100` : "N/A"}</span>
      </div>
      <Progress value={value} variant={variant as "default" | "success" | "warning" | "danger"} size="sm" />
    </div>
  );
}

function ReviewCard({ review }: { review: CompanyReview }) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold">{review.title}</h4>
            <p className="text-xs text-muted-foreground">
              {review.job_title && `${review.job_title} · `}
              {review.is_current_employee ? "Current Employee" : "Former Employee"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-4 text-warning-500 fill-warning-500" />
            <span className="text-sm font-medium">{review.rating}/5</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{review.content}</p>
        {review.pros && (
          <div>
            <p className="text-xs font-medium text-success-600">Pros</p>
            <p className="text-sm">{review.pros}</p>
          </div>
        )}
        {review.cons && (
          <div>
            <p className="text-xs font-medium text-danger-600">Cons</p>
            <p className="text-sm">{review.cons}</p>
          </div>
        )}
        <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ThumbsUp className="size-3" />
            {review.helpful_count} helpful
          </span>
          {review.recommend_to_friend !== null && (
            <span>{review.recommend_to_friend ? "Recommends" : "Doesn't recommend"}</span>
          )}
          <span>{new Date(review.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function InterviewCard({ interview }: { interview: CompanyInterview }) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold">{interview.title}</h4>
            <p className="text-xs text-muted-foreground">
              {interview.job_title && `${interview.job_title} · `}
              Difficulty: {interview.difficulty}/5
            </p>
          </div>
          {interview.offer_received !== null && (
            <Badge variant={interview.offer_received ? "success" : "danger"} size="sm">
              {interview.offer_received ? "Offer Received" : "No Offer"}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{interview.experience}</p>
        {interview.process_description && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Process:</span> {interview.process_description}
          </p>
        )}
        {interview.advice && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Advice:</span> {interview.advice}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {new Date(interview.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}

function SalaryCard({ salary }: { salary: CompanySalary }) {
  return (
    <Card>
      <CardContent className="p-5 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold">{salary.job_title}</h4>
            <p className="text-xs text-muted-foreground">
              {salary.experience_level && `${salary.experience_level} · `}
              {salary.location ?? "Remote"}
            </p>
          </div>
          <Badge variant="secondary" size="sm">{salary.currency}</Badge>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">
            {salary.salary_min.toLocaleString()} - {salary.salary_max.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">/year</span>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          {salary.base_salary && <span>Base: ${salary.base_salary.toLocaleString()}</span>}
          {salary.bonus && <span>Bonus: ${salary.bonus.toLocaleString()}</span>}
          {salary.stock_annual && <span>Stock: ${salary.stock_annual.toLocaleString()}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyOverview({ company }: { company: CompanyDetail }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">{company.description ?? "No description available."}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {company.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="size-4 text-muted-foreground" />
                <a href={company.website} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                  {company.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            {company.founded_year && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                Founded {company.founded_year}
              </div>
            )}
            {company.employee_count && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="size-4 text-muted-foreground" />
                {company.employee_count.toLocaleString()} employees
              </div>
            )}
            {company.headquarters_city && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="size-4 text-muted-foreground" />
                {company.headquarters_city}{company.headquarters_state ? `, ${company.headquarters_state}` : ""}{company.headquarters_country ? `, ${company.headquarters_country}` : ""}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageSquare className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold">{company.total_reviews}</p>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <DollarSign className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold">{company.total_salaries}</p>
            <p className="text-xs text-muted-foreground">Salaries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Briefcase className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold">{company.total_interviews}</p>
            <p className="text-xs text-muted-foreground">Interviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold">{company.followers_count}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold">{company.overall_score ?? "N/A"}</span>
            <span className="text-sm text-muted-foreground">Overall Score</span>
          </div>
          <Separator />
          <ScoreBar label="Culture" score={company.culture_score} />
          <ScoreBar label="Compensation" score={company.compensation_score} />
          <ScoreBar label="Work-Life Balance" score={company.work_life_balance_score} />
          <ScoreBar label="Career Growth" score={company.career_growth_score} />
          <ScoreBar label="Management" score={company.management_score} />
        </CardContent>
      </Card>

      {company.tags && company.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {company.tags.map((tag) => (
                <Badge key={tag} variant="default" size="md">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CultureTab({ company }: { company: CompanyDetail }) {
  const culture = company.culture_benefits;
  if (!culture) return <p className="text-sm text-muted-foreground">No culture data available.</p>;
  const scores = culture.culture_scores;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Culture Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScoreBar label="Work-Life Balance" score={scores.work_life_balance} />
          <ScoreBar label="Diversity & Inclusion" score={scores.diversity_inclusion} />
          <ScoreBar label="Compensation & Benefits" score={scores.compensation_benefits} />
          <ScoreBar label="Career Growth" score={scores.career_growth} />
          <ScoreBar label="Management" score={scores.management} />
          <ScoreBar label="Company Culture" score={scores.company_culture} />
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {culture.benefits.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {culture.benefits.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}
        {culture.perks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Perks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {culture.perks.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}
        {culture.values.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Company Values</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {culture.values.map((v) => <li key={v}>{v}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TechTab({ company }: { company: CompanyDetail }) {
  const techs = company.tech_stacks;
  if (!techs || techs.length === 0) {
    return <p className="text-sm text-muted-foreground">No technology data available.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {techs.map((stack) => (
        <Card key={stack.id}>
          <CardHeader>
            <CardTitle className="text-sm">{stack.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {stack.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" size="sm">{tech}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function NewsTab({ company }: { company: CompanyDetail }) {
  if (!company.news || company.news.length === 0) {
    return <p className="text-sm text-muted-foreground">No news available.</p>;
  }
  return (
    <div className="space-y-3">
      {company.news.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <a href={item.url} target="_blank" rel="noreferrer" className="block hover:underline">
              <h4 className="text-sm font-semibold">{item.title}</h4>
            </a>
            <p className="mt-1 text-xs text-muted-foreground">{item.summary}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{item.source}</span>
              <span>{new Date(item.published_at).toLocaleDateString()}</span>
              {item.sentiment && (
                <Badge
                  variant={item.sentiment === "positive" ? "success" : item.sentiment === "negative" ? "danger" : "secondary"}
                  size="sm"
                >
                  {item.sentiment}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FundingTab({ company }: { company: CompanyDetail }) {
  if (!company.funding_rounds || company.funding_rounds.length === 0) {
    return <p className="text-sm text-muted-foreground">No funding data available.</p>;
  }
  return (
    <div className="space-y-3">
      {company.funding_rounds.map((round) => (
        <Card key={round.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold">{round.round_type}</h4>
                <p className="text-xs text-muted-foreground">
                  {new Date(round.announced_date).toLocaleDateString()}
                </p>
              </div>
              {round.amount !== null && (
                <span className="text-lg font-bold">
                  ${round.amount.toLocaleString()} {round.currency}
                </span>
              )}
            </div>
            {round.valuation && (
              <p className="mt-1 text-xs text-muted-foreground">
                Valuation: ${round.valuation.toLocaleString()}
              </p>
            )}
            {round.lead_investors && round.lead_investors.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium">Lead Investors</p>
                <p className="text-xs text-muted-foreground">{round.lead_investors.join(", ")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LeadershipTab({ company }: { company: CompanyDetail }) {
  if (!company.leadership || company.leadership.length === 0) {
    return <p className="text-sm text-muted-foreground">No leadership data available.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {company.leadership.map((leader) => (
        <Card key={leader.id}>
          <CardContent className="p-4 flex items-center gap-3">
            <Avatar
              src={leader.avatar_url ?? undefined}
              fallback={leader.name}
              size="lg"
            />
            <div>
              <p className="text-sm font-semibold">{leader.name}</p>
              <p className="text-xs text-muted-foreground">{leader.title}</p>
              {leader.linkedin_url && (
                <a
                  href={leader.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-600 hover:underline"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CompetitorsTab({ company }: { company: CompanyDetail }) {
  if (!company.competitors || company.competitors.length === 0) {
    return <p className="text-sm text-muted-foreground">No competitor data available.</p>;
  }
  return (
    <div className="space-y-3">
      {company.competitors.map((comp) => (
        <Card key={comp.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={comp.competitor.logo_url ?? undefined}
                fallback={comp.competitor.name}
                size="md"
                variant="square"
              />
              <div>
                <Link
                  to={`/company-intel/company/${comp.competitor.slug}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {comp.competitor.name}
                </Link>
                <p className="text-xs text-muted-foreground">{comp.competitor.industry}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" size="sm">{comp.similarity_score}% match</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function IntelligenceTab({ company }: { company: CompanyDetail }) {
  if (!company.analyses || company.analyses.length === 0) {
    return <p className="text-sm text-muted-foreground">No intelligence analyses available.</p>;
  }
  return (
    <div className="space-y-3">
      {company.analyses.map((analysis) => (
        <Card key={analysis.id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={analysis.status === "completed" ? "success" : analysis.status === "failed" ? "danger" : "secondary"} size="sm">
                  {analysis.status}
                </Badge>
                {analysis.score !== null && (
                  <span className="text-sm font-bold">{analysis.score}/100</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(analysis.created_at).toLocaleDateString()}
              </span>
            </div>
            {analysis.insights && analysis.insights.length > 0 && (
              <div>
                <p className="text-xs font-medium">Insights</p>
                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                  {analysis.insights.map((insight, i) => (
                    <li key={i}>· {insight}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <p className="text-xs font-medium">Recommendations</p>
                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i}>· {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BookmarksTab({ company, isBookmarked, isFollowed }: { company: CompanyDetail; isBookmarked: boolean; isFollowed: boolean }) {
  const bookmarkMutation = useBookmarkCompany();
  const unbookmarkMutation = useUnbookmarkCompany();
  const followMutation = useFollowCompany();
  const unfollowMutation = useUnfollowCompany();

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-sm font-semibold">Bookmarks & Follows</h3>
        <p className="text-sm text-muted-foreground">
          Save this company for later or follow to get updates on changes and new reviews.
        </p>
        <div className="flex gap-3">
          {isBookmarked ? (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Bookmark className="size-4" />}
              onClick={() => unbookmarkMutation.mutate(company.id)}
              loading={unbookmarkMutation.isPending}
            >
              Bookmarked
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Bookmark className="size-4" />}
              onClick={() => bookmarkMutation.mutate(company.id)}
              loading={bookmarkMutation.isPending}
            >
              Bookmark
            </Button>
          )}
          {isFollowed ? (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Users className="size-4" />}
              onClick={() => unfollowMutation.mutate(company.id)}
              loading={unfollowMutation.isPending}
            >
              Following
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Users className="size-4" />}
              onClick={() => followMutation.mutate(company.id)}
              loading={followMutation.isPending}
            >
              Follow
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export const CompanyDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const companyId = id ?? "";
  const [activeTab, setActiveTab] = useState("overview");

  const { data: company, isLoading: isLoadingCompany } = useCompanyDetail(companyId);
  const { data: reviews = [], isLoading: isLoadingReviews } = useCompanyReviews(companyId);
  const { data: interviews = [], isLoading: isLoadingInterviews } = useCompanyInterviews(companyId);
  const { data: salaries = [], isLoading: isLoadingSalaries } = useCompanySalaries(companyId);

  if (isLoadingCompany) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="rectangular" height={400} />
        </div>
      </PageContainer>
    );
  }

  if (!company) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Company Not Found"
            description="The company you're looking for doesn't exist or has been removed"
            icon={<Building2 className="size-5" />}
            backHref="/company-intel/search"
          />
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium">Company not found</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link to="/company-intel/search">Back to Search</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  const isBookmarked = false;
  const isFollowed = false;

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title={company.name}
          description={company.industry}
          icon={
            company.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="size-10 rounded-lg object-cover" />
            ) : (
              <Building2 className="size-5" />
            )
          }
          backHref="/company-intel/search"
          actions={
            <>
              {company.website && (
                <Button variant="outline" size="sm" leftIcon={<ExternalLink className="size-4" />} asChild>
                  <a href={company.website} target="_blank" rel="noreferrer">Website</a>
                </Button>
              )}
            </>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({company.total_reviews})</TabsTrigger>
            <TabsTrigger value="interviews">Interviews ({company.total_interviews})</TabsTrigger>
            <TabsTrigger value="salary">Salary ({company.total_salaries})</TabsTrigger>
            <TabsTrigger value="culture">Culture & Benefits</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <CompanyOverview company={company} />
          </TabsContent>

          <TabsContent value="reviews">
            {isLoadingReviews ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={160} />
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="mx-auto size-10 text-muted-foreground/50" />
                  <p className="mt-3 text-sm font-medium">No reviews yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Be the first to review this company</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="interviews">
            {isLoadingInterviews ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={160} />
                ))}
              </div>
            ) : interviews.length > 0 ? (
              <div className="space-y-4">
                {interviews.map((interview) => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="mx-auto size-10 text-muted-foreground/50" />
                  <p className="mt-3 text-sm font-medium">No interviews yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="salary">
            {isLoadingSalaries ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={120} />
                ))}
              </div>
            ) : salaries.length > 0 ? (
              <div className="space-y-4">
                {salaries.map((salary) => (
                  <SalaryCard key={salary.id} salary={salary} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <DollarSign className="mx-auto size-10 text-muted-foreground/50" />
                  <p className="mt-3 text-sm font-medium">No salary data yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="culture">
            <CultureTab company={company} />
          </TabsContent>

          <TabsContent value="technology">
            <TechTab company={company} />
          </TabsContent>

          <TabsContent value="news">
            <NewsTab company={company} />
          </TabsContent>

          <TabsContent value="funding">
            <FundingTab company={company} />
          </TabsContent>

          <TabsContent value="leadership">
            <LeadershipTab company={company} />
          </TabsContent>

          <TabsContent value="competitors">
            <CompetitorsTab company={company} />
          </TabsContent>

          <TabsContent value="intelligence">
            <IntelligenceTab company={company} />
          </TabsContent>

          <TabsContent value="bookmarks">
            <BookmarksTab company={company} isBookmarked={isBookmarked} isFollowed={isFollowed} />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};
