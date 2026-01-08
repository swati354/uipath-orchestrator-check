import React from 'react';
import { useUiPathAuth } from '@/hooks/useUiPathAuth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
interface AuthWrapperProps {
  children: React.ReactNode;
}
export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isInitializing, isAuthenticated, error, reinitialize } = useUiPathAuth();
  if (isInitializing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FA4616] to-[#E55A1B] flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
                <CardTitle>Initializing UiPath SDK</CardTitle>
                <CardDescription>
                  Connecting to your UiPath Orchestrator instance...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FA4616] rounded-full animate-pulse" />
                    Setting up authentication
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    Verifying credentials
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    Loading workspace
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-lg">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-red-900">Authentication Error</CardTitle>
                <CardDescription>
                  Failed to connect to UiPath Orchestrator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Failed</AlertTitle>
                  <AlertDescription className="mt-2">
                    {error}
                  </AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <Button
                    onClick={reinitialize}
                    className="w-full bg-[#FA4616] hover:bg-[#E55A1B] text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Connection
                  </Button>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">Troubleshooting steps:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Verify your UiPath Orchestrator URL is correct</li>
                      <li>Check that your OAuth client ID is valid</li>
                      <li>Ensure your network allows connections to UiPath</li>
                      <li>Confirm your user has proper permissions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FA4616] to-[#E55A1B] flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Authentication Required</CardTitle>
                <CardDescription>
                  Please authenticate with your UiPath Orchestrator to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Required</AlertTitle>
                  <AlertDescription>
                    You need to sign in to access your automation resources.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={reinitialize}
                  className="w-full bg-[#FA4616] hover:bg-[#E55A1B] text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Sign In to UiPath
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to UiPath Orchestrator to complete authentication
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}