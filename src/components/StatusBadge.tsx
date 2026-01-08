import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'destructive' | 'info' | 'secondary';
  className?: string;
}
export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  // Auto-determine variant based on status if not provided
  const getVariantFromStatus = (status: string): string => {
    const normalizedStatus = status.toLowerCase();
    if (['available', 'success', 'completed', 'successful', 'active', 'published'].includes(normalizedStatus)) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (['running', 'busy', 'inprogress', 'assigned', 'pending'].includes(normalizedStatus)) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    if (['failed', 'error', 'disconnected', 'faulted', 'stopped'].includes(normalizedStatus)) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (['info', 'processing', 'queued'].includes(normalizedStatus)) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };
  const variantClasses = variant ? {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    destructive: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200',
  }[variant] : getVariantFromStatus(status);
  return (
    <Badge 
      className={cn(
        'text-xs font-medium border',
        variantClasses,
        className
      )}
    >
      {status}
    </Badge>
  );
}