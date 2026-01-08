import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getUiPath } from '../lib/uipath';
import type { BucketGetResponse } from 'uipath-sdk';

/**
 * Fetch all UiPath Storage Buckets
 *
 * @param enabled - Whether to enable the query (default: true)
 */
export function useUiPathBuckets(enabled = true): UseQueryResult<BucketGetResponse[], Error> {
	return useQuery({
		queryKey: ['uipath', 'buckets'],
		queryFn: async (): Promise<BucketGetResponse[]> => {
			const uipath = getUiPath();
			
			if (!uipath.isAuthenticated()) {
				throw new Error('Not authenticated. Please complete the authentication flow.');
			}
			
			const response = await uipath.buckets.getAll();
			return response.items;
		},
		enabled: enabled,
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
}
