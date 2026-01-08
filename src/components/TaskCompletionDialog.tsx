import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompleteTask } from '@/lib/uipath-hooks';
import { TaskType } from 'uipath-sdk';
import { toast } from 'sonner';
import { CheckCircle, Loader2 } from 'lucide-react';
interface TaskCompletionDialogProps {
  task: any;
  open: boolean;
  onClose: () => void;
}
export function TaskCompletionDialog({ task, open, onClose }: TaskCompletionDialogProps) {
  const [action, setAction] = useState('approve');
  const [comments, setComments] = useState('');
  const [customData, setCustomData] = useState('{}');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const completeTask = useCompleteTask();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task?.id) {
      toast.error('Invalid task selected');
      return;
    }
    setIsSubmitting(true);
    try {
      // Parse custom data if provided
      let taskData: Record<string, unknown> = {};
      if (comments.trim()) {
        taskData.comments = comments.trim();
      }
      if (customData.trim() && customData.trim() !== '{}') {
        try {
          const parsed = JSON.parse(customData);
          taskData = { ...taskData, ...parsed };
        } catch (error) {
          toast.error('Invalid JSON in custom data field');
          setIsSubmitting(false);
          return;
        }
      }
      // Determine task type - default to External if not specified
      const taskType = task.type || TaskType.External;
      if (taskType === TaskType.External) {
        // External tasks can be completed with optional data and action
        await completeTask.mutateAsync({
          taskId: task.id,
          type: TaskType.External,
          data: Object.keys(taskData).length > 0 ? taskData : undefined,
          action: action,
          folderId: 1 // Default folder - in real app this would be dynamic
        });
      } else {
        // App/Form tasks require data and action
        await completeTask.mutateAsync({
          taskId: task.id,
          type: taskType,
          data: taskData,
          action: action,
          folderId: 1 // Default folder - in real app this would be dynamic
        });
      }
      toast.success(`Task completed with action: ${action}`);
      setAction('approve');
      setComments('');
      setCustomData('{}');
      onClose();
    } catch (error) {
      console.error('Failed to complete task:', error);
      toast.error(`Failed to complete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    if (!isSubmitting) {
      setAction('approve');
      setComments('');
      setCustomData('{}');
      onClose();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Complete Task
          </DialogTitle>
          <DialogDescription>
            Complete "{task?.title || 'this task'}" by providing the required information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select value={action} onValueChange={setAction} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="submit">Submit</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Add any comments or notes..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customData">Custom Data (JSON)</Label>
            <Textarea
              id="customData"
              placeholder='{"key": "value"}'
              value={customData}
              onChange={(e) => setCustomData(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Optional JSON data to include with the task completion
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}