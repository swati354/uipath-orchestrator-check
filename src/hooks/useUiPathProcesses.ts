/**
 * React Query hook for UiPath Processes
 *
 * Provides methods to:
 * - Fetch all processes
 * - Start a process
 * - Get process by ID
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { getUiPath } from '../lib/uipath';
import { toast } from 'sonner';
import type { ProcessGetResponse, ProcessStartResponse } from 'uipath-sdk';

/**
 * Fetch all UiPath processes
 *
 * @param folderId - Optional folder ID to filter processes
 * @param enabled - Whether to enable the query (default: true)
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
			return (result as any).items || [];
		},
		enabled: enabled,
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
}

/**
 * Get a specific process by ID
 *
 * @param processId - The process ID
 * @param folderId - Required folder ID
 */
export function useUiPathProcess(processId: number | undefined, folderId: number): UseQueryResult<ProcessGetResponse, Error> {
	return useQuery({
		queryKey: ['uipath', 'processes', processId, folderId],
		queryFn: async (): Promise<ProcessGetResponse> => {
			if (!processId) throw new Error('Process ID is required');
			const uipath = getUiPath();
			
			if (!uipath.isAuthenticated()) {
				throw new Error('Not authenticated. Please complete the authentication flow.');
			}
			
			return await uipath.processes.getById(processId, folderId);
		},
		enabled: !!processId,
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
}

/**
 * Mutation to start a UiPath process
 *
 * Note: Returns an array of jobs created. Typically one job, but can be multiple
 * if the process is configured to run on multiple robots.
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
			toast.success('Process started successfully');
			// Invalidate processes query to refresh the list
			queryClient.invalidateQueries({ queryKey: ['uipath', 'processes'] });
		},
		onError: (error: Error) => {
			toast.error(`Failed to start process: ${error.message}`);
		},
	});
}
