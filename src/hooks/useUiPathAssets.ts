/**
 * React Query hook for UiPath Assets
 *
 * Provides methods to:
 * - Fetch all assets
 * - Get asset by ID
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getUiPath } from '../lib/uipath';
import type { AssetGetResponse } from 'uipath-sdk';

/**
 * Fetch all UiPath assets
 *
 * @param folderId - Optional folder ID to filter assets
 * @param enabled - Whether to enable the query (default: true)
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
			return (result as any).items || [];
		},
		enabled: enabled,
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
}

/**
 * Get a specific asset by ID
 *
 * @param assetId - The asset ID
 * @param folderId - Required folder ID
 */
export function useUiPathAsset(assetId: number | undefined, folderId: number): UseQueryResult<AssetGetResponse, Error> {
	return useQuery({
		queryKey: ['uipath', 'assets', assetId, folderId],
		queryFn: async (): Promise<AssetGetResponse> => {
			if (!assetId) throw new Error('Asset ID is required');
			const uipath = getUiPath();
			
			if (!uipath.isAuthenticated()) {
				throw new Error('Not authenticated. Please complete the authentication flow.');
			}
			
			return await uipath.assets.getById(assetId, folderId);
		},
		enabled: !!assetId,
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
}
