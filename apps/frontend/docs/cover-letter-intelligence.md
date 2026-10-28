# Cover Letter Intelligence — Frontend Documentation

## Architecture Overview

The Cover Letter Intelligence module follows the same patterns established by the Company Intelligence module. It is built on a layered architecture:

```
Pages (React Components)
  └─> Hooks (React Query + API calls)
       └─> Store (Zustand — client-side state)
            └─> Types (TypeScript interfaces)
```

### Directory Structure

```
apps/frontend/src/
├── types/cover-letter.ts            # All TypeScript interfaces and union types
├── stores/cover-letter.store.ts     # Zustand store for UI/filter state
├── hooks/useCoverLetter.ts          # React Query hooks (queries + mutations)
└── pages/cover-letter/
    ├── CoverLetterDashboardPage.tsx  # Dashboard with stats, activity, quick actions
    ├── CoverLetterListPage.tsx       # Search/filter list with pagination
    ├── CoverLetterDetailPage.tsx     # Main editor with 13 tab views
    ├── CoverLetterTemplatesPage.tsx  # Template CRUD with preview
    ├── CoverLetterCollectionsPage.tsx # Collection CRUD with drill-down
    ├── CoverLetterSettingsPage.tsx   # User preferences form
    ├── CoverLetterGenerateDialog.tsx # AI generation modal
    └── index.ts                      # Barrel export
```

---

## Integration Points

### Design System Components

All pages use components from `@/components/ui/`:

| Component | Usage |
|-----------|-------|
| `PageContainer` | Outer page wrapper with consistent padding |
| `PageHeader` | Title, description, icon, and action buttons |
| `Card / CardHeader / CardTitle / CardContent` | All content sections |
| `Button` | All actions (with `leftIcon`, `loading`, `asChild` props) |
| `Badge` | Status, tone, style, and score indicators |
| `Input / Textarea` | All form fields |
| `Skeleton` | Loading states (variant="rectangular") |
| `Progress` | Score bars with variant-based coloring |
| `Tabs / TabsList / TabsTrigger / TabsContent` | Detail page tab navigation |
| `Switch` | Boolean toggles in settings |
| `Separator` | Visual dividers |
| `Statistic` | Dashboard stat cards |

### Layout Components

- `PageContainer` — consistent page padding/max-width
- `PageHeader` — standardized page header with `title`, `description`, `icon`, `backHref`, `actions`

### Existing Modules Referenced

- **Company Intelligence** (`@/hooks/useCompanyIntel`, `@/stores/company-intel.store`, `@/types/company-intel`) — the pattern source
- **Resume module** — hooks pattern for versions, comments, sharing, collections

---

## Component Hierarchy

```
App
├── CoverLetterDashboardPage
│   ├── PageHeader (Create New, Templates, Settings buttons)
│   ├── Statistic cards (Total, Generated, Approved, Avg Score)
│   ├── Recent Cover Letters list
│   ├── Quick Actions
│   └── Activity Feed / Tone Distribution
│
├── CoverLetterListPage
│   ├── PageHeader (New Cover Letter button)
│   ├── Search bar + Filter toggle
│   ├── Filter panel (status, tone, score, sort)
│   ├── Letter cards (title, job, company, status, score, tags)
│   └── Pagination
│
├── CoverLetterDetailPage (13 tabs)
│   ├── PageHeader (title, company, status badge, version, score)
│   ├── Tabs
│   │   ├── Editor — fields, content textarea, AI panel, scores
│   │   ├── Suggestions — AI suggestions with apply/dismiss
│   │   ├── Rewrites — original vs rewritten with apply/undo
│   │   ├── Optimizations — score before/after with improvement %
│   │   ├── Versions — version history with set-current
│   │   ├── Comparison — side-by-side version diff
│   │   ├── Approvals — submit/review/approve/reject workflow
│   │   ├── History — event timeline
│   │   ├── Analytics — views, shares, exports, rating, score trend
│   │   ├── Sharing — create/revoke share links
│   │   ├── Comments — threaded comments with resolve
│   │   ├── Reports — generated reports list
│   │   └── Bookmarks — bookmark/unbookmark
│   └── CoverLetterGenerateDialog (shared)
│
├── CoverLetterTemplatesPage
│   ├── PageHeader (New Template button)
│   ├── Template cards (name, industry, tone, style, usage count)
│   ├── TemplateDialog (create/edit)
│   └── PreviewDialog
│
├── CoverLetterCollectionsPage
│   ├── PageHeader (New Collection button)
│   ├── Collection cards (name, color, letter count)
│   ├── CollectionDialog (create/edit)
│   └── CollectionDetail (drill-down view)
│
└── CoverLetterSettingsPage
    ├── Defaults (tone, style, temperature, max tokens)
    ├── Automation (auto-generate, auto-optimize toggles)
    ├── Signature (name, title, email, phone, linkedin)
    └── AI Provider (provider, model)
```

---

## Service Pattern

### React Query Keys

Query keys follow a hierarchical pattern for cache invalidation:

```ts
coverLetterKeys = {
  all: ["cover-letter"],
  letters: () => [...all, "letters"],
  letter: (id) => [...letters(), id],
  versions: (id) => [...letter(id), "versions"],
  suggestions: (id) => [...letter(id), "suggestions"],
  // ... etc
}
```

### Mock API Pattern

All hooks use a `mockApi` helper that wraps responses in a delayed promise:

```ts
function mockApi<T>(data: T, delay = 500): Promise<{ data: T }> {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), delay));
}
```

This enables frontend development before backend integration. Replace `mockApi` calls with actual `fetch`/`axios` calls when the API is ready.

### Mutation Pattern

All mutations invalidate relevant query keys via `useQueryClient`:

```ts
export function useCreateCoverLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CoverLetterCreate) => { ... },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: coverLetterKeys.letters() });
    },
  });
}
```

---

## React Query Hooks Reference

### Cover Letters

| Hook | Type | Purpose |
|------|------|---------|
| `useCoverLetters()` | Query | Paginated list with filters from store |
| `useCoverLetterDetail(id)` | Query | Single letter with all metadata |
| `useCreateCoverLetter()` | Mutation | Create new letter |
| `useUpdateCoverLetter()` | Mutation | Update letter fields |
| `useDeleteCoverLetter()` | Mutation | Delete a letter |
| `useGenerateCoverLetter()` | Mutation | AI-generate content |

### Versions

| Hook | Type | Purpose |
|------|------|---------|
| `useCoverLetterVersions(id)` | Query | List all versions |
| `useSaveAsVersion()` | Mutation | Save current as new version |
| `useSetCurrentVersion()` | Mutation | Rollback to a version |

### Suggestions

| Hook | Type | Purpose |
|------|------|---------|
| `useCoverLetterSuggestions(id)` | Query | AI suggestions list |
| `useApplySuggestion()` | Mutation | Accept and apply a suggestion |
| `useDismissSuggestion()` | Mutation | Dismiss a suggestion |

### Rewrites

| Hook | Type | Purpose |
|------|------|---------|
| `useCoverLetterRewrites(id)` | Query | Rewrite history |
| `useApplyRewrite()` | Mutation | Apply a rewrite |
| `useUndoRewrite()` | Mutation | Undo an applied rewrite |

### Optimizations

| Hook | Type | Purpose |
|------|------|---------|
| `useCoverLetterOptimizations(id)` | Query | Optimization history |
| `useApplyOptimization()` | Mutation | Apply an optimization |

### Approvals

| Hook | Type | Purpose |
|------|------|---------|
| `useCoverLetterApprovals(id)` | Query | Approval history |
| `useSubmitForApproval()` | Mutation | Submit for review |
| `useApproveLetter()` | Mutation | Approve a letter |
| `useRejectLetter()` | Mutation | Reject a letter |

### Sharing

| Hook | Type | Purpose |
|------|------|---------|
| `useCoverLetterShares(id)` | Query | Active share links |
| `useCreateShare()` | Mutation | Create a share link |
| `useRevokeShare()` | Mutation | Revoke a share link |

### Comments

| Hook | Type | Purpose |
|------|------|---------|
| `useCoverLetterComments(id)` | Query | Threaded comments |
| `useAddComment()` | Mutation | Add a comment |
| `useResolveComment()` | Mutation | Resolve a comment |

### Templates

| Hook | Type | Purpose |
|------|------|---------|
| `useCoverLetterTemplates()` | Query | All templates |
| `useCoverLetterTemplate(id)` | Query | Single template |
| `useCreateTemplate()` | Mutation | Create template |
| `useUpdateTemplate()` | Mutation | Update template |
| `useDeleteTemplate()` | Mutation | Delete template |

### Collections

| Hook | Type | Purpose |
|------|------|---------|
| `useCoverLetterCollections()` | Query | All collections |
| `useCoverLetterCollectionDetail(id)` | Query | Collection with letters |
| `useCreateCoverLetterCollection()` | Mutation | Create collection |
| `useUpdateCoverLetterCollection()` | Mutation | Update collection |
| `useDeleteCoverLetterCollection()` | Mutation | Delete collection |
| `useAddToCoverLetterCollection()` | Mutation | Add letter to collection |
| `useRemoveFromCoverLetterCollection()` | Mutation | Remove letter from collection |

### Settings & Analytics

| Hook | Type | Purpose |
|------|------|---------|
| `useCoverLetterSettings()` | Query | User settings |
| `useUpdateCoverLetterSettings()` | Mutation | Update settings |
| `useCoverLetterStats()` | Query | Dashboard stats |
| `useCoverLetterAnalytics(id)` | Query | Per-letter analytics |
| `useCoverLetterHistory(id)` | Query | Event history |
| `useCoverLetterReports(id)` | Query | Generated reports |
| `useBookmarkCoverLetter()` | Mutation | Bookmark a letter |
| `useUnbookmarkCoverLetter()` | Mutation | Unbookmark a letter |

---

## State Management Overview

### Zustand Store (`cover-letter.store.ts`)

The store manages UI-only state that doesn't belong in the server cache:

```ts
interface CoverLetterState {
  // List filters (synced with useCoverLetters query)
  filters: { search, status, tone, style, min_score, max_score, date_from, date_to, tags, sort_by, sort_order, page, per_page }
  setFilters: (partial) => void
  resetFilters: () => void

  // Multi-select
  selectedLetterIds: string[]
  toggleLetterSelection: (id) => void
  clearSelection: () => void

  // Tab state
  activeTab: string
  setActiveTab: (tab) => void

  // Version comparison
  comparisonLeftVersionId: string | null
  comparisonRightVersionId: string | null

  // Generate dialog
  generateDialogOpen: boolean
  setGenerateDialogOpen: (open) => void

  // Settings (local cache)
  settings: CoverLetterSettings
  updateSettings: (partial) => void
}
```

**Key principle:** Server state lives in React Query. Client/UI state lives in Zustand. Never duplicate.

---

## Page Routing

Expected route configuration:

```tsx
<Route path="/cover-letter" element={<CoverLetterDashboardPage />} />
<Route path="/cover-letter/list" element={<CoverLetterListPage />} />
<Route path="/cover-letter/generate" element={<CoverLetterDetailPage />} />
<Route path="/cover-letter/:id" element={<CoverLetterDetailPage />} />
<Route path="/cover-letter/templates" element={<CoverLetterTemplatesPage />} />
<Route path="/cover-letter/collections" element={<CoverLetterCollectionsPage />} />
<Route path="/cover-letter/collections/:id" element={<CoverLetterCollectionsPage />} />
<Route path="/cover-letter/settings" element={<CoverLetterSettingsPage />} />
```

---

## Future Extension Points

1. **Real-time Collaboration** — Add WebSocket support to Comments and Editor tabs for live multi-user editing
2. **Rich Text Editor** — Replace the textarea in the Editor tab with a ProseMail/Tiptap/Slate editor for formatting
3. **Email Integration** — Direct send from the Approvals tab via SMTP/API
4. **Job Board Sync** — Auto-populate job details from linked job postings in the Job module
5. **Resume Integration** — Pull career profile data to auto-fill cover letter context
6. **ATS Scoring** — Integrate with the ATS module for letter-specific ATS scoring
7. **Batch Operations** — Use the `selectedLetterIds` store state for bulk status changes, exports, deletes
8. **PDF/DOCX Export** — Generate formatted documents from cover letter content
9. **Template Marketplace** — Make templates publicly shareable with ratings and usage stats
10. **Version Branching** — Allow branching from any version (not just current)
11. **AI Chat** — Add a conversational AI assistant tab for iterative refinement
12. **Webhooks** — Trigger external automations on approval, submission, or generation events
