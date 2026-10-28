import { type FC } from "react";
import { Settings, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useResumeOptimizationRules, useDeleteResumeOptimizationRule } from "@/hooks/useResumeOptimization";

export const OptimizationRulesPage: FC = () => {
  const { data: rules, isLoading } = useResumeOptimizationRules();
  const deleteRule = useDeleteResumeOptimizationRule();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Optimization Rules"
          description="Configure rules that drive suggestion generation"
          icon={<Settings className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="size-4" />}>New Rule</Button>
          }
        />

        {isLoading ? (
          <Skeleton variant="rectangular" height={300} />
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules?.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell><Badge variant="outline">{rule.rule_type}</Badge></TableCell>
                      <TableCell className="text-sm">{rule.category ?? "—"}</TableCell>
                      <TableCell>{rule.weight}</TableCell>
                      <TableCell>{rule.priority}</TableCell>
                      <TableCell>{rule.is_active ? <Eye className="size-4 text-green-500" /> : <EyeOff className="size-4 text-muted-foreground" />}</TableCell>
                      <TableCell>{rule.is_system ? <Badge variant="info">System</Badge> : "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteRule.mutate(rule.id)}><Trash2 className="size-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!rules?.length && (
                    <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No rules found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
