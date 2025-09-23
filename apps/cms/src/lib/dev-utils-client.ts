// Client-side dev utilities for auto-login functionality

/**
 * Check if dev auto-login should be enabled (client-side)
 * This is a simplified check that only works in development
 */
export function isDevAutoLoginEnabled(): boolean {
  // Only check NODE_ENV on client side
  // DEV_AUTOSIGNIN and other env vars are not available on client
  return process.env.NODE_ENV !== 'production';
}
