import { type FC } from "react";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const OptimizationAppliedPage: FC = () => {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Applied Changes"
          description="All successfully applied optimizations across sessions"
          icon={<CheckCircle2 className="size-5" />}
        />

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Suggestion</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Applied At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No changes applied yet.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
