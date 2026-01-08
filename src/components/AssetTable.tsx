import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUiPathAssets } from '@/lib/uipath-hooks';
import { useUiPathAuth } from '@/hooks/useUiPathAuth';
import { Search, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { AssetGetResponse } from 'uipath-sdk';
export function AssetTable() {
  const { isAuthenticated } = useUiPathAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleValues, setVisibleValues] = useState<Set<number>>(new Set());
  const { data: assets, isLoading, error, refetch } = useUiPathAssets(undefined, isAuthenticated);
  const toggleValueVisibility = (assetId: number) => {
    const newVisible = new Set(visibleValues);
    if (newVisible.has(assetId)) {
      newVisible.delete(assetId);
    } else {
      newVisible.add(assetId);
    }
    setVisibleValues(newVisible);
  };
  // Handle pagination - UiPath SDK returns either array or paginated response
  const assetArray: AssetGetResponse[] = React.useMemo(() => {
    if (!assets) return [];
    if (Array.isArray(assets)) return assets;
    // Handle paginated response structure
    if (typeof assets === 'object' && 'value' in assets && Array.isArray(assets.value)) {
      return assets.value;
    }
    return [];
  }, [assets]);
  // Filter assets based on search
  const filteredAssets = assetArray.filter((asset) =>
    asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getValueTypeColor = (valueType: string) => {
    switch (valueType?.toLowerCase()) {
      case 'text':
        return 'bg-blue-100 text-blue-800';
      case 'integer':
        return 'bg-green-100 text-green-800';
      case 'boolean':
        return 'bg-purple-100 text-purple-800';
      case 'credential':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const maskValue = (value: string | undefined, valueType: string) => {
    if (valueType?.toLowerCase() === 'credential' || valueType?.toLowerCase() === 'password') {
      return '••••••••';
    }
    if (value && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return value || 'N/A';
  };
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-32" />
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
            Failed to load assets: {error.message}
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
      {/* Search */}
      <div className="p-6 pb-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      {/* Table */}
      <div className="border-t border-border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Asset Name</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Type</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Value</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Scope</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  {searchTerm
                    ? 'No assets match your search'
                    : 'No assets found. Create assets in UiPath Orchestrator to see them here.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="py-3">
                    <div>
                      <div className="font-medium text-sm text-foreground">{asset.name}</div>
                      {asset.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {asset.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge className={`text-xs ${getValueTypeColor(asset.valueType)}`}>
                      {asset.valueType || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="font-mono text-sm text-muted-foreground max-w-xs">
                      {visibleValues.has(asset.id)
                        ? asset.value || 'N/A'
                        : maskValue(asset.value, asset.valueType)}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground">
                      {asset.valueScope || 'Global'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    {asset.valueType?.toLowerCase() === 'credential' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleValueVisibility(asset.id)}
                        className="h-8 w-8 p-0"
                      >
                        {visibleValues.has(asset.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}