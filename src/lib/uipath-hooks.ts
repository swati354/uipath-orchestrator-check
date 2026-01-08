/**
 * Centralized UiPath SDK React Query Hooks
 * 
 * This file consolidates all UiPath SDK hooks with proper authentication handling,
 * error management, and consistent patterns across the application.
 */
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { getUiPath } from '@/lib/uipath';
import { toast } from 'sonner';
import type { 
  ProcessGetResponse, 
  ProcessStartResponse, 
  AssetGetResponse,
  RawTaskGetResponse, 
  TaskAssignmentResponse,
  TaskType 
} from 'uipath-sdk';
// ============================================================================
// PROCESSES HOOKS
// ============================================================================
/**
 * Fetch all UiPath processes with authentication handling
 */
export function useUiPathProcesses(folderId?: number, enabled = true): UseQueryResult<ProcessGetResponse[], Error> {
  return useQuery({
    queryKey: ['uipath', 'processes', folderId],
    queryFn: async (): Promise<ProcessGetResponse[]> => {
      const uipath = getUiPath();
      if (!uipath.isAuthenticated()) {
        throw new Error('Not authenticated. Please complete the authentication flow.');
      }
      const result = await uipath.processes.getAll(
        folderId ? { folderId } : undefined
      );
      // Handle both paginated and direct array responses
      if (Array.isArray(result)) {
        return result;
      }
      return (result as any).value || [];
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}
/**
 * Mutation to start a UiPath process
 */
export function useStartProcess(): UseMutationResult<ProcessStartResponse[], Error, { processKey: string; folderId: number }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      processKey,
      folderId,
    }: {
      processKey: string;
      folderId: number;
    }): Promise<ProcessStartResponse[]> => {
      const uipath = getUiPath();
      if (!uipath.isAuthenticated()) {
        throw new Error('UiPath SDK not authenticated. Please authenticate first.');
      }
      return await uipath.processes.start({ processKey }, folderId);
    },
    onSuccess: () => {
      // Invalidate processes query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['uipath', 'processes'] });
    },
    onError: (error: Error) => {
      console.error('Failed to start process:', error);
    },
  });
}
// ============================================================================
// ASSETS HOOKS
// ============================================================================
/**
 * Fetch all UiPath assets with authentication handling
 */
export function useUiPathAssets(folderId?: number, enabled = true): UseQueryResult<AssetGetResponse[], Error> {
  return useQuery({
    queryKey: ['uipath', 'assets', folderId],
    queryFn: async (): Promise<AssetGetResponse[]> => {
      const uipath = getUiPath();
      if (!uipath.isAuthenticated()) {
        throw new Error('Not authenticated. Please complete the authentication flow.');
      }
      const result = await uipath.assets.getAll(
        folderId ? { folderId } : undefined
      );
      // Handle both paginated and direct array responses
      if (Array.isArray(result)) {
        return result;
      }
      return (result as any).value || [];
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}
// ============================================================================
// TASKS HOOKS
// ============================================================================
/**
 * Fetch all UiPath tasks with authentication handling
 */
export function useUiPathTasks(folderId?: number, enabled = true): UseQueryResult<RawTaskGetResponse[], Error> {
  return useQuery({
    queryKey: ['uipath', 'tasks', folderId],
    queryFn: async (): Promise<RawTaskGetResponse[]> => {
      const uipath = getUiPath();
      if (!uipath.isAuthenticated()) {
        throw new Error('Not authenticated. Please complete the authentication flow.');
      }
      const result = await uipath.tasks.getAll(
        folderId ? { folderId } : undefined
      );
      // Handle both paginated and direct array responses
      if (Array.isArray(result)) {
        return result;
      }
      return (result as any).value || [];
    },
    enabled: enabled,
    staleTime: 1 * 60 * 1000, // Consider data fresh for 1 minute
    gcTime: 3 * 60 * 1000, // Keep in cache for 3 minutes
  });
}
/**
 * Mutation to assign a task to a user
 */
export function useAssignTask(): UseMutationResult<TaskAssignmentResponse[], Error, { taskId: number; userNameOrEmail: string }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      userNameOrEmail,
    }: {
      taskId: number;
      userNameOrEmail: string;
    }): Promise<TaskAssignmentResponse[]> => {
      const uipath = getUiPath();
      if (!uipath.isAuthenticated()) {
        throw new Error('UiPath SDK not authenticated. Please authenticate first.');
      }
      const result = await uipath.tasks.assign({ taskId, userNameOrEmail });
      // SDK returns OperationResponse with data field containing array
      return result.data as TaskAssignmentResponse[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uipath', 'tasks'] });
    },
    onError: (error: Error) => {
      console.error('Failed to assign task:', error);
    },
  });
}
/**
 * Mutation to complete a task with support for all task types
 */
export function useCompleteTask(): UseMutationResult<
  void,
  Error,
  | { taskId: number; type: TaskType.External; data?: Record<string, unknown>; action?: string; folderId: number }
  | { taskId: number; type: TaskType.App | TaskType.Form; data: Record<string, unknown>; action: string; folderId: number }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params:
      | { taskId: number; type: TaskType.External; data?: Record<string, unknown>; action?: string; folderId: number }
      | { taskId: number; type: TaskType.App | TaskType.Form; data: Record<string, unknown>; action: string; folderId: number }
    ): Promise<void> => {
      const { taskId, type, folderId, data, action } = params;
      const uipath = getUiPath();
      if (!uipath.isAuthenticated()) {
        throw new Error('UiPath SDK not authenticated. Please authenticate first.');
      }
      await uipath.tasks.complete(
        {
          type,
          taskId,
          ...(data !== undefined && { data }),
          ...(action !== undefined && { action }),
        } as any,
        folderId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uipath', 'tasks'] });
    },
    onError: (error: Error) => {
      console.error('Failed to complete task:', error);
    },
  });
}