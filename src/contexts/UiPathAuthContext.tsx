import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { initializeUiPathSDK, getUiPath } from '@/lib/uipath';
interface UiPathAuthContextType {
  isInitializing: boolean;
  isAuthenticated: boolean;
  error: string | null;
  reinitialize: () => Promise<void>;
}
const UiPathAuthContext = createContext<UiPathAuthContextType | undefined>(undefined);
export function UiPathAuthProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialize = async () => {
    try {
      setIsInitializing(true);
      setError(null);
      console.log('🔐 Auth Context: Starting SDK initialization...');
      await initializeUiPathSDK();
      const uipath = getUiPath();
      const authStatus = uipath.isAuthenticated();
      console.log('🔐 Auth Context: Authentication status:', authStatus);
      setIsAuthenticated(authStatus);
      if (!authStatus) {
        console.log('🔐 Auth Context: Not authenticated, checking for ongoing OAuth flow...');
        const urlParams = new URLSearchParams(window.location.search);
        const hasCode = urlParams.has('code');
        const hasError = urlParams.has('error');
        if (!hasCode && !hasError) {
          console.log('🔐 Auth Context: No OAuth callback detected, user may need to authenticate');
        }
      }
    } catch (err) {
      console.error('🔐 Auth Context: Initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize UiPath SDK');
      setIsAuthenticated(false);
    } finally {
      setIsInitializing(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);
  const reinitialize = async () => {
    await initialize();
  };
  return (
    <UiPathAuthContext.Provider
      value={{
        isInitializing,
        isAuthenticated,
        error,
        reinitialize,
      }}
    >
      {children}
    </UiPathAuthContext.Provider>
  );
}
// Export context for the hook to use
export { UiPathAuthContext };