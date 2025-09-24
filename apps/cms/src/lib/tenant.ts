import { auth } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"

/**
 * Server-only function that resolves the current tenant ID from the request context.
 * 
 * Resolution priority:
 * 1. Current Clerk organization ID (preferred)
 * 2. DEV_TENANT_ID environment variable (for development/seed)
 * 3. Throws error if no tenant can be resolved
 * 
 * @returns Promise<string> - The resolved tenant ID
 * @throws Error if no tenant ID can be resolved
 */
export async function getTenantIdFromRequest(): Promise<string> {
  try {
    // First, try to get the current organization from Clerk
    const { orgId } = await auth()
    
    if (orgId) {
      return orgId
    }
    
  } catch {
    // Clerk auth failed (user not signed in), continue to fallback
    console.log('Clerk auth not available, trying fallback...')
  }
  
  // Fallback to dev tenant ID for development/seed scenarios
  const devTenantId = process.env.DEV_TENANT_ID
  if (devTenantId) {
    console.warn('⚠️  Using DEV_TENANT_ID fallback - ensure this is only in development')
    return devTenantId
  }
  
  // If no tenant can be resolved, throw an error
  throw new Error('No tenant ID could be resolved. User must be part of an organization or DEV_TENANT_ID must be set.')
}

/**
 * Asserts that the current user has access to the specified tenant.
 * 
 * For now, this is a placeholder that simply returns the tenantId.
 * In the future, this will check membership/role against the Clerk user.
 * 
 * @param tenantId - The tenant ID to check access for
 * @returns Promise<string> - The validated tenant ID
 * @throws Error if access is denied
 */
export async function assertTenantAccess(tenantId: string): Promise<string> {
  try {
    // TODO: Implement actual membership/role checking against Clerk user
    // For now, just validate that we have a tenant ID
    if (!tenantId || typeof tenantId !== 'string') {
      throw new Error('Invalid tenant ID provided')
    }
    
    // Future implementation will check:
    // 1. User is authenticated
    // 2. User is a member of the organization (tenantId)
    // 3. User has appropriate role/permissions
    
    return tenantId
    
  } catch (error) {
    console.error('Tenant access assertion failed:', error)
    throw new Error('Access denied to tenant')
  }
}

/**
 * Creates a tenant-specific cache tag for revalidation.
 * 
 * @param tenantId - The tenant ID
 * @returns string - Cache tag in format "tenant:${tenantId}"
 */
export function TENANT_TAG(tenantId: string): string {
  if (!tenantId || typeof tenantId !== 'string') {
    throw new Error('Invalid tenant ID provided for cache tag')
  }
  
  return `tenant:${tenantId}`
}

/**
 * Helper function to get tenant ID and assert access in one call.
 * This is a convenience function for server actions and API routes.
 * 
 * @returns Promise<string> - The validated tenant ID
 * @throws Error if tenant cannot be resolved or access is denied
 */
export async function getValidatedTenantId(): Promise<string> {
  const tenantId = await getTenantIdFromRequest()
  return await assertTenantAccess(tenantId)
}

/**
 * Resolves tenant ID from siteId header for public endpoints (like submissions).
 * This is used when the endpoint needs to be accessible without authentication.
 * 
 * @param request - The NextRequest object
 * @returns Promise<string> - The resolved tenant ID
 * @throws Error if no tenant can be resolved
 */
export async function getTenantIdFromSiteId(request: NextRequest): Promise<string> {
  // Get siteId from header
  const siteId = request.headers.get('x-site-id')
  
  if (siteId) {
    // For now, we'll use the siteId directly as tenantId
    // In the future, this could be a lookup table or domain-based resolution
    return siteId
  }
  
  // Fallback to dev tenant ID for development
  const devTenantId = process.env.DEV_TENANT_ID
  if (devTenantId) {
    console.warn('⚠️  Using DEV_TENANT_ID fallback for public endpoint - ensure this is only in development')
    return devTenantId
  }
  
  throw new Error('No tenant ID could be resolved from siteId header or DEV_TENANT_ID')
}

/**
 * Type-safe tenant ID that ensures the string is a valid tenant identifier.
 */
export type TenantId = string & { readonly __brand: 'TenantId' }

/**
 * Type guard to check if a string is a valid tenant ID.
 * 
 * @param value - The value to check
 * @returns boolean - True if the value is a valid tenant ID
 */
export function isValidTenantId(value: unknown): value is TenantId {
  return typeof value === 'string' && value.length > 0 && value.startsWith('org_')
}

/**
 * Creates a type-safe tenant ID from a string.
 * 
 * @param value - The string to convert to a tenant ID
 * @returns TenantId - The type-safe tenant ID
 * @throws Error if the value is not a valid tenant ID
 */
export function createTenantId(value: string): TenantId {
  if (!isValidTenantId(value)) {
    throw new Error(`Invalid tenant ID format: ${value}. Expected format: org_xxxxxxxxxx`)
  }
  
  return value as TenantId
}
