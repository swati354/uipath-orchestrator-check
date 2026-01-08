import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { useUiPathProcesses, useStartProcess } from '@/lib/uipath-hooks';
import { useUiPathAuth } from '@/contexts/UiPathAuthContext';
import { Play, Search, Filter, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
export function ProcessTable() {
  const { isAuthenticated } = useUiPathAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: processes, isLoading, error, refetch } = useUiPathProcesses(undefined, isAuthenticated);
  const startProcess = useStartProcess();
  const handleStartProcess = async (processKey: string, processName: string) => {
    try {
      await startProcess.mutateAsync({
        processKey,
        folderId: 1 // Default folder - in real app this would be dynamic
      });
      toast.success(`Process "${processName}" started successfully`);
    } catch (error) {
      console.error('Failed to start process:', error);
      toast.error(`Failed to start process: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  // Handle pagination - UiPath SDK returns either array or paginated response
  const processArray = Array.isArray(processes) ? processes : processes?.value || [];
  // Filter processes based on search and status
  const filteredProcesses = processArray.filter((process) => {
    const matchesSearch = process.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && process.isLatestVersion) ||
                         (statusFilter === 'active' && process.isActive);
    return matchesSearch && matchesStatus;
  });
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-20" />
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
            Failed to load processes: {error.message}
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
            placeholder="Search processes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Table */}
      <div className="border-t border-border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Process</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Version</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Status</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide">Last Modified</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wide text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProcesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No processes match your filters' 
                    : 'No processes found. Create processes in UiPath Orchestrator to see them here.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredProcesses.map((process) => (
                <TableRow key={process.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="py-3">
                    <div>
                      <div className="font-medium text-sm text-foreground">{process.name}</div>
                      {process.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {process.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm font-mono text-muted-foreground">
                      {process.processVersion || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge 
                      status={process.isLatestVersion ? 'Available' : 'Inactive'} 
                      variant={process.isLatestVersion ? 'success' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground">
                      {process.lastModifiedTime 
                        ? new Date(process.lastModifiedTime).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button
                      size="sm"
                      onClick={() => handleStartProcess(process.key, process.name)}
                      disabled={startProcess.isPending || !process.isLatestVersion}
                      className="bg-[#FA4616] hover:bg-[#E55A1B] text-white"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
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