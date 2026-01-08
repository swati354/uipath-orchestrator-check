import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Queue, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
interface QueueMonitorProps {
  queue: {
    id: number | string;
    name: string;
    description?: string;
    itemCounts: {
      new: number;
      inProgress: number;
      failed: number;
      successful: number;
    };
  };
}
export function QueueMonitor({ queue }: QueueMonitorProps) {
  const totalItems = Object.values(queue.itemCounts).reduce((sum, count) => sum + count, 0);
  const getStatusColor = (status: string, count: number) => {
    if (count === 0) return 'bg-gray-100 text-gray-600';
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'inProgress':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'successful':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-3 w-3" />;
      case 'inProgress':
        return <TrendingUp className="h-3 w-3" />;
      case 'failed':
        return <AlertTriangle className="h-3 w-3" />;
      case 'successful':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FA4616] to-[#E55A1B] flex items-center justify-center">
            <Queue className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate">
              {queue.name}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {totalItems} total items
            </CardDescription>
          </div>
        </div>
        {queue.description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {queue.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {getStatusIcon('new')}
                <span className="text-xs text-muted-foreground">New</span>
              </div>
              <Badge className={`text-xs ${getStatusColor('new', queue.itemCounts.new)}`}>
                {queue.itemCounts.new}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {getStatusIcon('inProgress')}
                <span className="text-xs text-muted-foreground">In Progress</span>
              </div>
              <Badge className={`text-xs ${getStatusColor('inProgress', queue.itemCounts.inProgress)}`}>
                {queue.itemCounts.inProgress}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {getStatusIcon('successful')}
                <span className="text-xs text-muted-foreground">Success</span>
              </div>
              <Badge className={`text-xs ${getStatusColor('successful', queue.itemCounts.successful)}`}>
                {queue.itemCounts.successful}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {getStatusIcon('failed')}
                <span className="text-xs text-muted-foreground">Failed</span>
              </div>
              <Badge className={`text-xs ${getStatusColor('failed', queue.itemCounts.failed)}`}>
                {queue.itemCounts.failed}
              </Badge>
            </div>
          </div>
        </div>
        {totalItems > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#FA4616] to-[#E55A1B] h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.max(5, (queue.itemCounts.successful / totalItems) * 100)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Success Rate</span>
              <span>{totalItems > 0 ? Math.round((queue.itemCounts.successful / totalItems) * 100) : 0}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}