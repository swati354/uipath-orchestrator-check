import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProcessTable } from '@/components/ProcessTable';
import { AssetTable } from '@/components/AssetTable';
import { Settings, Play } from 'lucide-react';
export function ProcessesAssetsTab() {
  return (
    <div className="space-y-8">
      {/* Processes Section */}
      <Card className="border-border shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-border">
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-[#FA4616]" />
            <div>
              <CardTitle className="text-lg font-semibold">Automation Processes</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                View and manage your automation processes with quick-start capabilities
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ProcessTable />
        </CardContent>
      </Card>
      <Separator className="my-8" />
      {/* Assets Section */}
      <Card className="border-border shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#FA4616]" />
            <div>
              <CardTitle className="text-lg font-semibold">Configuration Assets</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Manage configuration values and credentials with secure value masking
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AssetTable />
        </CardContent>
      </Card>
    </div>
  );
}