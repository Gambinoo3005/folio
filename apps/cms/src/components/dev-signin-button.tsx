'use client';

import { Button } from '@/components/ui/button';
import { isDevAutoLoginEnabled } from '@/lib/dev-utils-client';
import Link from 'next/link';

export function DevSignInButton() {
  // Only show in development when dev auto-login is enabled
  if (process.env.NODE_ENV === 'production' || !isDevAutoLoginEnabled()) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-muted">
      <Button variant="outline" size="sm" asChild className="w-full">
        <Link href="/dev/ensure">
          Sign in as Dev
        </Link>
      </Button>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Development mode only
      </p>
    </div>
  );
}
