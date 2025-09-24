import { auth, currentUser } from "@clerk/nextjs/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN', 
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export interface UserRole {
  userId: string
  tenantId: string
  role: Role
}

/**
 * Role hierarchy - higher roles include permissions of lower roles
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.OWNER]: 4,
  [Role.ADMIN]: 3,
  [Role.EDITOR]: 2,
  [Role.VIEWER]: 1,
}

/**
 * Get the current user's role for the current tenant
 * This will be hydrated from Clerk organization membership
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const { userId, orgId } = await auth()
    
    if (!userId || !orgId) {
      return null
    }
    
    // For now, we'll use a simple mapping based on Clerk's organization roles
    // In the future, this will query the Membership table
    const membership = await prisma.membership.findUnique({
      where: {
        userId_tenantId: {
          userId,
          tenantId: orgId,
        },
      },
      select: {
        userId: true,
        tenantId: true,
        role: true,
      },
    })
    
    if (membership) {
      return {
        userId: membership.userId,
        tenantId: membership.tenantId,
        role: membership.role as Role,
      }
    }
    
    // Fallback: if no membership record exists, try to get role from Clerk
    // This is a temporary solution until we implement proper membership sync
    const user = await currentUser()
    if (user && (user as any).organizationMemberships) {
      const orgMembership = (user as any).organizationMemberships.find(
        (membership: any) => membership.organization.id === orgId
      )
      
      if (orgMembership) {
        // Map Clerk roles to our Role enum
        const clerkRole = orgMembership.role
        let role: Role
        
        switch (clerkRole) {
          case 'org:admin':
            role = Role.ADMIN
            break
          case 'org:member':
            role = Role.EDITOR // Default members can edit
            break
          default:
            role = Role.VIEWER
        }
        
        // Create or update membership record
        await prisma.membership.upsert({
          where: {
            userId_tenantId: {
              userId,
              tenantId: orgId,
            },
          },
          update: {
            role,
          },
          create: {
            userId,
            tenantId: orgId,
            role,
          },
        })
        
        return {
          userId,
          tenantId: orgId,
          role,
        }
      }
    }
    
    return null
    
  } catch (error) {
    console.error('Failed to get current user role:', error)
    return null
  }
}

/**
 * Check if a role has permission to perform an action
 */
export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

/**
 * Require a specific role for the current user
 * Throws an error if the user doesn't have sufficient permissions
 */
export async function requireRole(requiredRole: Role): Promise<UserRole> {
  const userRole = await getCurrentUserRole()
  
  if (!userRole) {
    throw new Error('Authentication required')
  }
  
  if (!hasPermission(userRole.role, requiredRole)) {
    throw new Error(`Insufficient permissions. Required: ${requiredRole}, Current: ${userRole.role}`)
  }
  
  return userRole
}

/**
 * Check if the current user can perform write operations
 * OWNER, ADMIN, and EDITOR can write; VIEWER is read-only
 */
export async function requireWritePermission(): Promise<UserRole> {
  return await requireRole(Role.EDITOR)
}

/**
 * Check if the current user can perform admin operations
 * Only OWNER and ADMIN can perform admin operations
 */
export async function requireAdminPermission(): Promise<UserRole> {
  return await requireRole(Role.ADMIN)
}

/**
 * Check if the current user is the owner
 * Only OWNER can perform owner operations
 */
export async function requireOwnerPermission(): Promise<UserRole> {
  return await requireRole(Role.OWNER)
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: Role): string {
  switch (role) {
    case Role.OWNER:
      return 'Owner'
    case Role.ADMIN:
      return 'Administrator'
    case Role.EDITOR:
      return 'Editor'
    case Role.VIEWER:
      return 'Viewer'
    default:
      return 'Unknown'
  }
}

/**
 * Get role description
 */
export function getRoleDescription(role: Role): string {
  switch (role) {
    case Role.OWNER:
      return 'Full access to all features and settings'
    case Role.ADMIN:
      return 'Administrative access to most features'
    case Role.EDITOR:
      return 'Can create and edit content'
    case Role.VIEWER:
      return 'Read-only access to content'
    default:
      return 'Unknown role'
  }
}
