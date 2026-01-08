import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getUiPath } from '../lib/uipath';
import type { RawEntityGetResponse } from 'uipath-sdk';

/**
 * Fetch all UiPath Data Fabric entities
 *
 * @param enabled - Whether to enable the query (default: true)
 */
export function useUiPathEntities(enabled = true): UseQueryResult<RawEntityGetResponse[], Error> {
	return useQuery({
		queryKey: ['uipath', 'entities'],
		queryFn: async (): Promise<RawEntityGetResponse[]> => {
			const uipath = getUiPath();
			
			if (!uipath.isAuthenticated()) {
				throw new Error('Not authenticated. Please complete the authentication flow.');
			}
			
			const response = await uipath.entities.getAll();
			console.log('[useUiPathEntities] Fetched entities:', response.length);
			return response;
		},
		enabled: enabled,
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
}
