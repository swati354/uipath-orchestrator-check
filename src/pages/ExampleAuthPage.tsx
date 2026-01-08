import React from 'react';
import { useUiPathAuth } from '@/contexts/UiPathAuthContext';
import { AuthWrapper } from '@/components/AuthWrapper';
import { useUiPathProcesses } from '@/hooks/useUiPathProcesses';

/**
 * Example page showing proper authentication handling
 * 
 * Key points:
 * 1. Use AuthWrapper to handle loading/error states
 * 2. Only enable queries when authenticated
 * 3. No refetchInterval - authentication state drives data fetching
 */
export function ExampleAuthPage() {
  const { isAuthenticated } = useUiPathAuth();
  
  // Only fetch data when authenticated
  const { data: processes, isLoading, error } = useUiPathProcesses(
    undefined, // folderId
    isAuthenticated // Only enable when authenticated
  );

  return (
    <AuthWrapper>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">UiPath Processes</h1>
        
        {isLoading && (
          <div className="text-muted-foreground">Loading processes...</div>
        )}
        
        {error && (
          <div className="text-destructive">Error: {error.message}</div>
        )}
        
        {processes && (
          <div className="grid gap-4">
            {processes.map((process) => (
              <div key={process.id} className="p-4 border rounded">
                <h2 className="font-semibold">{process.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthWrapper>
  );
}