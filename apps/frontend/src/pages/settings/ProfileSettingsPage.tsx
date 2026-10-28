import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUpdateProfileMutation } from "@/hooks/useAuthMutations";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { UpdateProfileRequest } from "@/types";

interface ProfileData {
  headline: string;
  summary: string;
  location: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  phone_number: string | null;
  bio: string;
}

export function ProfileSettingsPage() {
  const { user } = useAuth();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const updateProfile = useUpdateProfileMutation();

  const { data: profile } = useQuery<ProfileData>({
    queryKey: ["auth", "profile"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/profile");
      return response.data?.data ?? response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const [form, setForm] = useState<UpdateProfileRequest>({
    full_name: "",
    headline: "",
    summary: "",
    location: "",
    website_url: "",
    linkedin_url: "",
    github_url: "",
    phone_number: "",
    bio: "",
  });

  useEffect(() => {
    if (currentUser || profile) {
      setForm({
        full_name: currentUser?.full_name ?? "",
        headline: profile?.headline ?? "",
        summary: profile?.summary ?? "",
        location: profile?.location ?? "",
        website_url: profile?.website_url ?? "",
        linkedin_url: profile?.linkedin_url ?? "",
        github_url: profile?.github_url ?? "",
        phone_number: profile?.phone_number ?? "",
        bio: profile?.bio ?? "",
      });
    }
  }, [currentUser, profile]);

  const handleChange = (
    field: keyof UpdateProfileRequest,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateProfileRequest = {};
    for (const [key, value] of Object.entries(form)) {
      if (value !== "" && value !== null && value !== undefined) {
        (payload as Record<string, string>)[key] = value as string;
      }
    }
    updateProfile.mutate(payload);
  };

  const displayName = user?.full_name ?? "User";

  if (isLoadingUser) {
    return (
      <PageContainer narrow>
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" color="primary" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer narrow>
      <div className="space-y-8">
        <PageHeader
          title="Profile Settings"
          description="Manage your personal information"
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Info</CardTitle>
              <CardDescription>
                Update your profile details and public information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar
                  size="2xl"
                  src={user?.avatar_url ?? undefined}
                  fallback={displayName}
                />
                <div>
                  <Button variant="outline" size="sm" type="button" disabled>
                    Change photo
                  </Button>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 2 MB.
                  </p>
                </div>
              </div>

              {/* Full name */}
              <Field label="Full name" htmlFor="full_name">
                <Input
                  id="full_name"
                  value={form.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  placeholder="Your full name"
                />
              </Field>

              {/* Email (read-only) */}
              <Field label="Email" htmlFor="email">
                <div className="flex items-center gap-2">
                  <Input
                    id="email"
                    value={user?.email ?? ""}
                    readOnly
                    disabled
                    className="flex-1"
                  />
                  {user?.is_verified ? (
                    <Badge variant="success" size="sm" icon={<CheckCircle2 />}>
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Unverified
                    </Badge>
                  )}
                </div>
              </Field>

              {/* Headline */}
              <Field label="Headline" htmlFor="headline">
                <Input
                  id="headline"
                  value={form.headline}
                  onChange={(e) => handleChange("headline", e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                />
              </Field>

              {/* Summary */}
              <Field label="Summary" htmlFor="summary">
                <textarea
                  id="summary"
                  value={form.summary}
                  onChange={(e) => handleChange("summary", e.target.value)}
                  placeholder="A brief summary about yourself"
                  rows={3}
                  className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </Field>

              {/* Location */}
              <Field label="Location" htmlFor="location">
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                />
              </Field>

              {/* Website */}
              <Field label="Website URL" htmlFor="website_url">
                <Input
                  id="website_url"
                  type="url"
                  value={form.website_url}
                  onChange={(e) => handleChange("website_url", e.target.value)}
                  placeholder="https://example.com"
                />
              </Field>

              {/* LinkedIn */}
              <Field label="LinkedIn URL" htmlFor="linkedin_url">
                <Input
                  id="linkedin_url"
                  type="url"
                  value={form.linkedin_url}
                  onChange={(e) => handleChange("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </Field>

              {/* GitHub */}
              <Field label="GitHub URL" htmlFor="github_url">
                <Input
                  id="github_url"
                  type="url"
                  value={form.github_url}
                  onChange={(e) => handleChange("github_url", e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </Field>

              {/* Phone */}
              <Field label="Phone number" htmlFor="phone_number">
                <Input
                  id="phone_number"
                  type="tel"
                  value={form.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </Field>

              {/* Bio */}
              <Field label="Bio" htmlFor="bio">
                <textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell us more about yourself"
                  rows={4}
                  className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </Field>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                variant="primary"
                loading={updateProfile.isPending}
                disabled={updateProfile.isPending}
              >
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
}
