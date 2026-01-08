import React, { ReactNode } from 'react';
import { useUiPathAuth } from '@/contexts/UiPathAuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface AuthWrapperProps {
  children: ReactNode;
  loadingMessage?: string;
  errorTitle?: string;
}

export function AuthWrapper({ 
  children, 
  loadingMessage = "Initializing UiPath SDK...",
  errorTitle = "Failed to initialize UiPath SDK"
}: AuthWrapperProps) {
  const { isInitializing, isAuthenticated, error } = useUiPathAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Initializing UiPath SDK</h2>
            <p className="text-sm text-muted-foreground">
              {loadingMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              <div className="space-y-2">
                <p className="font-medium">{errorTitle}</p>
                <p className="text-sm">{error}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Please check your .env configuration and ensure your UiPath credentials are correct.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              <div className="space-y-2">
                <p className="font-medium">Authentication Required</p>
                <p className="text-sm">
                  Please complete the OAuth authentication flow to access UiPath services.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  If the authentication window doesn't open automatically, please refresh the page.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}