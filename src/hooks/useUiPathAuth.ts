import { useContext } from 'react';
import { UiPathAuthContext } from '@/contexts/UiPathAuthContext';
export function useUiPathAuth() {
  const context = useContext(UiPathAuthContext);
  if (context === undefined) {
    throw new Error('useUiPathAuth must be used within a UiPathAuthProvider');
  }
  return context;
}