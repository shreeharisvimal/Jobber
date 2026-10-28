import { type FC } from "react";
import { BookOpen, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useATSRules, useATSRuleSets, useATSRuleCategories, useDeleteATSRule, useDeleteATSRuleSet, useDeleteATSRuleCategory } from "@/hooks/useATS";

export const ATSRuleLibraryPage: FC = () => {
  const { data: rules, isLoading: rulesLoading } = useATSRules();
  const { data: ruleSets } = useATSRuleSets();
  const { data: categories } = useATSRuleCategories();
  const deleteRule = useDeleteATSRule();
  const deleteRuleSet = useDeleteATSRuleSet();
  const deleteCategory = useDeleteATSRuleCategory();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="ATS Rule Library"
          description="Manage analysis rules, rule sets, and categories"
          icon={<BookOpen className="size-5" />}
          actions={
            <>
              <Button variant="outline" size="sm" leftIcon={<Plus className="size-4" />}>New Rule Set</Button>
              <Button size="sm" leftIcon={<Plus className="size-4" />}>New Rule</Button>
            </>
          }
        />

        <Tabs defaultValue="rules">
          <TabsList>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="sets">Rule Sets</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="rules">
            <Card>
              <CardContent className="p-0">
                {rulesLoading ? (
                  <Skeleton variant="rectangular" height={300} />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dimension</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rules?.map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell className="font-medium">{rule.name}</TableCell>
                          <TableCell><Badge variant="outline">{rule.rule_type}</Badge></TableCell>
                          <TableCell className="capitalize">{rule.dimension}</TableCell>
                          <TableCell>
                            <Badge variant={rule.severity === "critical" ? "destructive" : rule.severity === "high" ? "warning" : "default"}>
                              {rule.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>{rule.weight}</TableCell>
                          <TableCell>{rule.is_active ? <Eye className="size-4 text-green-500" /> : <EyeOff className="size-4 text-muted-foreground" />}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => deleteRule.mutate(rule.id)}><Trash2 className="size-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!rules?.length && (
                        <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No rules found</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sets">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ruleSets?.map((set) => (
                <Card key={set.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{set.name}</CardTitle>
                        {set.description && <CardDescription>{set.description}</CardDescription>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteRuleSet.mutate(set.id)}><Trash2 className="size-4 text-destructive" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant={set.is_active ? "success" : "default"}>{set.is_active ? "Active" : "Inactive"}</Badge>
                      {set.is_default && <Badge>Default</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{set.rules?.length ?? 0} rules</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories?.map((cat) => (
                <Card key={cat.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {cat.color && <span className="size-3 rounded-full" style={{ backgroundColor: cat.color }} />}
                          {cat.name}
                        </CardTitle>
                        {cat.description && <CardDescription>{cat.description}</CardDescription>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteCategory.mutate(cat.id)}><Trash2 className="size-4 text-destructive" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{cat.rules?.length ?? 0} rules</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};
