import { type FC } from "react";
import { FileText, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const ATSReportsPage: FC = () => {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="ATS Reports"
          description="View and download generated reports"
          icon={<FileText className="size-5" />}
          actions={
            <Button size="sm" leftIcon={<Download className="size-4" />}>
              Export All
            </Button>
          }
        />

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Analysis</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No reports generated yet. Run an analysis and generate a report to see it here.
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
