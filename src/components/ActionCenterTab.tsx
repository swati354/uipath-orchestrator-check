import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskTable } from '@/components/TaskTable';
import { CheckSquare } from 'lucide-react';
export function ActionCenterTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-border">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-[#FA4616]" />
            <div>
              <CardTitle className="text-lg font-semibold">Action Center Tasks</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Manage pending tasks with assignment and completion workflows
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TaskTable />
        </CardContent>
      </Card>
    </div>
  );
}