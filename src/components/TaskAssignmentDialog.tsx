import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAssignTask } from '@/lib/uipath-hooks';
import { toast } from 'sonner';
import { UserPlus, Loader2 } from 'lucide-react';
interface TaskAssignmentDialogProps {
  task: any;
  open: boolean;
  onClose: () => void;
}
export function TaskAssignmentDialog({ task, open, onClose }: TaskAssignmentDialogProps) {
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const assignTask = useAssignTask();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) {
      toast.error('Please enter a user email');
      return;
    }
    if (!task?.id) {
      toast.error('Invalid task selected');
      return;
    }
    setIsSubmitting(true);
    try {
      await assignTask.mutateAsync({
        taskId: task.id,
        userNameOrEmail: userEmail.trim()
      });
      toast.success(`Task assigned to ${userEmail}`);
      setUserEmail('');
      onClose();
    } catch (error) {
      console.error('Failed to assign task:', error);
      toast.error(`Failed to assign task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    if (!isSubmitting) {
      setUserEmail('');
      onClose();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#FA4616]" />
            Assign Task
          </DialogTitle>
          <DialogDescription>
            Assign "{task?.title || 'this task'}" to a user by entering their email address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userEmail">User Email</Label>
            <Input
              id="userEmail"
              type="email"
              placeholder="user@company.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
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
              disabled={isSubmitting || !userEmail.trim()}
              className="bg-[#FA4616] hover:bg-[#E55A1B] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}