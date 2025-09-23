'use client';

import { useUser, useOrganization } from '@clerk/nextjs';
import { isDevAutoLoginEnabled } from '@/lib/dev-utils-client';
import Link from 'next/link';
import { X, User, Building } from 'lucide-react';

export function DevSessionBanner() {
  const { user } = useUser();
  const { organization } = useOrganization();

  // Only show in development when dev auto-login is enabled
  if (process.env.NODE_ENV === 'production' || !isDevAutoLoginEnabled() || !user) {
    return null;
  }

  return (
    <div className="bg-orange-500 text-white px-4 py-2 text-sm font-medium flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>DEV SESSION</span>
        </div>
        <div className="flex items-center space-x-2 text-orange-100">
          <span>{user.primaryEmailAddress?.emailAddress}</span>
          {organization && (
            <>
              <span>•</span>
              <Building className="h-3 w-3" />
              <span>{organization.name}</span>
            </>
          )}
        </div>
      </div>
      <Link 
        href="/dev/logout" 
        className="flex items-center space-x-1 hover:bg-orange-600 px-2 py-1 rounded transition-colors"
      >
        <X className="h-3 w-3" />
        <span>Dev Logout</span>
      </Link>
    </div>
  );
}
