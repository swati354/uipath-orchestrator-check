import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Package } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
interface ProcessCardProps {
  process: {
    id: number | string;
    name: string;
    key: string;
    description?: string;
    version?: string;
    isLatestVersion?: boolean;
    lastModifiedTime?: string;
  };
  onStart: (processKey: string) => void;
  isStarting?: boolean;
}
export function ProcessCard({ process, onStart, isStarting = false }: ProcessCardProps) {
  const handleStart = () => {
    onStart(process.key);
  };
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FA4616] to-[#E55A1B] flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">
                {process.name}
              </CardTitle>
            </div>
          </div>
          <StatusBadge 
            status={process.isLatestVersion ? 'Available' : 'Inactive'}
            variant={process.isLatestVersion ? 'success' : 'secondary'}
          />
        </div>
        {process.description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {process.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>Version</span>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {process.version || 'N/A'}
          </Badge>
        </div>
        {process.lastModifiedTime && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Modified</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(process.lastModifiedTime).toLocaleDateString()}
            </span>
          </div>
        )}
        <div className="pt-2 border-t border-border">
          <Button
            onClick={handleStart}
            disabled={isStarting || !process.isLatestVersion}
            className="w-full bg-[#FA4616] hover:bg-[#E55A1B] text-white"
            size="sm"
          >
            {isStarting ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                Starting...
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-2" />
                Start Process
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}