import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, UserPlus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
interface TaskCardProps {
  task: {
    id: number | string;
    title: string;
    description?: string;
    priority: string;
    status: string;
    dueDate?: string;
    assignee?: string;
    creationTime?: string;
  };
  onAssign: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  isAssigning?: boolean;
  isCompleting?: boolean;
}
export function TaskCard({ 
  task, 
  onAssign, 
  onComplete, 
  isAssigning = false, 
  isCompleting = false 
}: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'unassigned':
        return 'warning';
      case 'assigned':
      case 'inprogress':
        return 'info';
      case 'completed':
      case 'successful':
        return 'success';
      case 'failed':
      case 'faulted':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  const canAssign = !task.assignee || task.status?.toLowerCase() === 'pending';
  const canComplete = task.assignee && task.status?.toLowerCase() !== 'completed';
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FA4616] to-[#E55A1B] flex items-center justify-center">
              <CheckSquare className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">
                {task.title}
              </CardTitle>
            </div>
          </div>
          <StatusBadge 
            status={task.status}
            variant={getStatusVariant(task.status)}
          />
        </div>
        {task.description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Priority</span>
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Assignee</span>
            <span className="text-xs font-medium">
              {task.assignee || 'Unassigned'}
            </span>
          </div>
          {task.creationTime && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Created</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(task.creationTime), { addSuffix: true })}
              </span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                <span>Due</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        <div className="pt-2 border-t border-border space-y-2">
          {canAssign && (
            <Button
              onClick={() => onAssign(String(task.id))}
              disabled={isAssigning}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isAssigning ? (
                <>
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserPlus className="h-3 w-3 mr-2" />
                  Assign Task
                </>
              )}
            </Button>
          )}
          {canComplete && (
            <Button
              onClick={() => onComplete(String(task.id))}
              disabled={isCompleting}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              {isCompleting ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-2" />
                  Complete Task
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}