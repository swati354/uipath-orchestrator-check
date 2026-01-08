/**
 * React Query hook for UiPath Queues
 *
 * Provides methods to:
 * - Fetch all queues
 * - Get queue by ID
 *
 * Note: Queue item management (add/update/delete items) is not yet available in the SDK.
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getUiPath } from '../lib/uipath';
import type { QueueGetResponse } from 'uipath-sdk';

/**
 * Fetch all UiPath queues
 *
 * @param folderId - Optional folder ID to filter queues
 * @param enabled - Whether to enable the query (default: true)
 */
export function useUiPathQueues(folderId?: number, enabled = true): UseQueryResult<QueueGetResponse[], Error> {
	return useQuery({
		queryKey: ['uipath', 'queues', folderId],
		queryFn: async (): Promise<QueueGetResponse[]> => {
			const uipath = getUiPath();
			
			if (!uipath.isAuthenticated()) {
				throw new Error('Not authenticated. Please complete the authentication flow.');
			}
			
			const result = await uipath.queues.getAll(
				folderId ? { folderId } : undefined
			);
			// Handle both paginated and direct array responses
			if (Array.isArray(result)) {
				return result;
			}
			return (result as any).items || [];
		},
		enabled: enabled,
		staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
		gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
	});
}

/**
 * Get a specific queue by ID
 *
 * @param queueId - The queue ID
 * @param folderId - Required folder ID
 */
export function useUiPathQueue(queueId: number | undefined, folderId: number): UseQueryResult<QueueGetResponse, Error> {
	return useQuery({
		queryKey: ['uipath', 'queues', queueId, folderId],
		queryFn: async (): Promise<QueueGetResponse> => {
			if (!queueId) throw new Error('Queue ID is required');
			const uipath = getUiPath();
			
			if (!uipath.isAuthenticated()) {
				throw new Error('Not authenticated. Please complete the authentication flow.');
			}
			
			return await uipath.queues.getById(queueId, folderId);
		},
		enabled: !!queueId,
		staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
		gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
	});
}

