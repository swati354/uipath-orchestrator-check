import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { TaskAssignmentDialog } from '@/components/TaskAssignmentDialog';
import { TaskCompletionDialog } from '@/components/TaskCompletionDialog';
import { useUiPathTasks } from '@/lib/uipath-hooks';
import { useUiPathAuth } from '@/hooks/useUiPathAuth';
import { Search, Filter, UserPlus, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import type { RawTaskGetResponse } from 'uipath-sdk';
export function TaskTable() {
  const { isAuthenticated } = useUiPathAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTaskForAssignment, setSelectedTaskForAssignment] = useState<RawTaskGetResponse | null>(null);
  const [selectedTaskForCompletion, setSelectedTaskForCompletion] = useState<RawTaskGetResponse | null>(null);
  const { data: tasks, isLoading, error, refetch } = useUiPathTasks(undefined, isAuthenticated);
  // Handle pagination - UiPath SDK returns either array or paginated response
  const taskArray: RawTaskGetResponse[] = React.useMemo(() => {
    if (!tasks) return [];
    if (Array.isArray(tasks)) return tasks;
    // Handle paginated response structure
    if (typeof tasks === 'object' && 'value' in tasks && Array.isArray((tasks as any).value)) {
      return (tasks as any).value;
    }
    return [];
  }, [tasks]);
  // Filter tasks based on search and status
  const filteredTasks = taskArray.filter((task) => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                         task.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });
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
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };
  // Helper function to get assignee display name
  const getAssigneeDisplay = (assignedToUser: any): string => {
    if (!assignedToUser) return 'Unassigned';
    if (typeof assignedToUser === 'string') return assignedToUser;
    if (typeof assignedToUser === 'object' && assignedToUser.userName) {
      return assignedToUser.userName;
    }
    return 'Assigned';
  };
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-16 flex-1" />
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-16 w-32" />
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load tasks: {error.message}
            <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 p-6 pb-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="inprogress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Table */}
      <div className="border-t border-border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Task</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Priority</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Status</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Assignee</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Created</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No tasks match your filters'
                    : 'No tasks found. Create tasks in UiPath Action Center to see them here.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="py-3">
                    <div>
                      <div className="font-medium text-sm text-foreground">{task.title || 'Untitled Task'}</div>
                      {task.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {typeof task.description === 'string' ? task.description : JSON.stringify(task.description)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority || 'Medium'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge
                      status={task.status || 'Pending'}
                      variant={getStatusVariant(task.status)}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground">
                      {getAssigneeDisplay(task.assignedToUser)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {task.createdTime
                        ? formatDistanceToNow(new Date(task.createdTime), { addSuffix: true })
                        : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      {(!task.assignedToUser || task.status?.toLowerCase() === 'pending') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTaskForAssignment(task)}
                          className="text-xs"
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      )}
                      {task.assignedToUser && task.status?.toLowerCase() !== 'completed' && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedTaskForCompletion(task)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Dialogs */}
      <TaskAssignmentDialog
        task={selectedTaskForAssignment}
        open={!!selectedTaskForAssignment}
        onClose={() => setSelectedTaskForAssignment(null)}
      />
      <TaskCompletionDialog
        task={selectedTaskForCompletion}
        open={!!selectedTaskForCompletion}
        onClose={() => setSelectedTaskForCompletion(null)}
      />
    </div>
  );
}