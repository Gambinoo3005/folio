'use client';

import { useState } from 'react';
import { Button } from '@portfolio-building-service/ui';
import { ExternalLink } from 'lucide-react';
import { openCustomerPortal } from '@/server/actions/billing';

interface BillingPortalButtonProps {
  className?: string;
}

export function BillingPortalButton({ className }: BillingPortalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPortal = async () => {
    setIsLoading(true);
    try {
      const { portalUrl } = await openCustomerPortal();
      // Redirect to the Stripe customer portal
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      // You could show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleOpenPortal}
      disabled={isLoading}
      className={className}
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      {isLoading ? 'Opening...' : 'Manage Billing'}
    </Button>
  );
}
