// Dev utilities for auto-login functionality
// Server-side only utilities

export interface DevConfig {
  isDevMode: boolean;
  devEmail: string;
  devOrgName: string;
  appHost: string;
}

/**
 * Check if dev auto-login should be enabled based on environment variables
 * All conditions must be true for dev mode to be active
 */
export function isDevAutoLoginEnabled(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.DEV_AUTOSIGNIN === 'true' &&
    process.env.APP_HOST_DEV === 'localhost:3001'
  );
}

/**
 * Get dev configuration from environment variables
 */
export function getDevConfig(): DevConfig | null {
  if (!isDevAutoLoginEnabled()) {
    return null;
  }

  return {
    isDevMode: true,
    devEmail: process.env.DEV_EMAIL || 'dev@folio.local',
    devOrgName: process.env.DEV_ORG_NAME || 'Dev Org (Folio)',
    appHost: process.env.APP_HOST_DEV || 'localhost:3001',
  };
}

/**
 * Check if the request host matches the expected dev host
 */
export function isDevHost(request: Request): boolean {
  const config = getDevConfig();
  if (!config) return false;
  
  const host = request.headers.get('host');
  return host === config.appHost;
}

/**
 * Validate that all dev auto-login conditions are met
 */
export function validateDevAutoLogin(request: Request): boolean {
  return isDevAutoLoginEnabled() && isDevHost(request);
}
