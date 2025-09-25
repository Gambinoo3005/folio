/**
 * Vercel API Service
 *
 * This service is responsible for all interactions with the Vercel API.
 * It provides a set of typed helpers for managing domains, projects, and DNS records.
 *
 * @see https://vercel.com/docs/rest-api
 */
import { z } from 'zod';

// ============================================================================
// CONSTANTS
// ============================================================================

const VERCEL_API_URL = 'https://api.vercel.com';
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

// ============================================================================
// API FETCHER
// ============================================================================

/**
 * A generic fetcher for the Vercel API.
 * It handles authentication and team selection.
 *
 * @param endpoint - The API endpoint to call (e.g., /v10/projects)
 * @param options - The fetch options (e.g., method, body)
 * @returns The JSON response from the API
 */
async function vercelApiFetcher(endpoint: string, options: RequestInit = {}) {
  const url = VERCEL_TEAM_ID
    ? `${VERCEL_API_URL}${endpoint}?teamId=${VERCEL_TEAM_ID}`
    : `${VERCEL_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Vercel API Error: ${response.status} ${response.statusText}`, {
      endpoint,
      error: errorText,
    });
    throw new Error(`Vercel API request failed: ${errorText}`);
  }

  return response.json();
}

// ============================================================================
// DOMAIN MANAGEMENT
// ============================================================================

/**
 * Zod schema for the response when creating a domain.
 * This is based on the Vercel API documentation.
 * @see https://vercel.com/docs/rest-api/endpoints/projects#add-a-domain-to-a-project
 */
const CreateDomainResponseSchema = z.object({
  name: z.string(),
  apexName: z.string(),
  projectId: z.string(),
  redirect: z.string().nullable(),
  redirectStatusCode: z.number().nullable(),
  gitBranch: z.string().nullable(),
  updatedAt: z.number(),
  createdAt: z.number(),
  verified: z.boolean(),
  verification: z.array(
    z.object({
      type: z.string(),
      domain: z.string(),
      value: z.string(),
      reason: z.string(),
    })
  ),
});

export type CreateDomainResponse = z.infer<typeof CreateDomainResponseSchema>;

/**
 * Adds a domain to a Vercel project.
 *
 * @param projectId - The ID of the project to add the domain to.
 * @param hostname - The hostname to add (e.g., example.com).
 * @returns The domain creation response from Vercel.
 */
export async function createDomain(
  projectId: string,
  hostname: string
): Promise<CreateDomainResponse> {
  const endpoint = `/v10/projects/${projectId}/domains`;
  const body = JSON.stringify({ name: hostname });

  const response = await vercelApiFetcher(endpoint, {
    method: 'POST',
    body,
  });

  return CreateDomainResponseSchema.parse(response);
}

/**
 * Zod schema for the response when getting a domain.
 * This is based on the Vercel API documentation.
 * @see https://vercel.com/docs/rest-api/endpoints/domains#get-a-domain-s-configuration
 */
const GetDomainResponseSchema = z.object({
  name: z.string(),
  apexName: z.string(),
  projectId: z.string(),
  redirect: z.string().nullable(),
  redirectStatusCode: z.number().nullable(),
  gitBranch: z.string().nullable(),
  updatedAt: z.number(),
  createdAt: z.number(),
  verified: z.boolean(),
  verification: z.array(
    z.object({
      type: z.string(),
      domain: z.string(),
      value: z.string(),
      reason: z.string(),
    })
  ),
  creator: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
  }),
});

export type GetDomainResponse = z.infer<typeof GetDomainResponseSchema>;

/**
 * Retrieves a domain's configuration from Vercel.
 *
 * @param hostname - The hostname to look up.
 * @returns The domain configuration.
 */
export async function getDomain(
  projectId: string,
  hostname: string
): Promise<GetDomainResponse> {
  const endpoint = `/v10/projects/${projectId}/domains/${hostname}`;
  const response = await vercelApiFetcher(endpoint);
  return GetDomainResponseSchema.parse(response);
}

/**
 * Removes a domain from a Vercel project.
 *
 * @param projectId - The ID of the project to remove the domain from.
 * @param hostname - The hostname to remove.
 */
export async function removeDomain(
  projectId: string,
  hostname: string
): Promise<void> {
  const endpoint = `/v10/projects/${projectId}/domains/${hostname}`;
  await vercelApiFetcher(endpoint, {
    method: 'DELETE',
  });
}

/**
 * Zod schema for the project lookup response.
 */
const ProjectLookupSchema = z.object({
  id: z.string(),
  name: z.string(),
});

/**
 * Looks up a Vercel project by its name.
 *
 * @param projectName - The name of the project to look up.
 * @returns The project details.
 */
export async function projectLookup(
  projectName: string
): Promise<z.infer<typeof ProjectLookupSchema>> {
  const endpoint = `/v9/projects/${projectName}`;
  const response = await vercelApiFetcher(endpoint);
  return ProjectLookupSchema.parse(response);
}

/**
 * Zod schema for the domain config response.
 */
const DomainConfigSchema = z.object({
  configuredBy: z.string().nullable(),
  nameservers: z.array(z.string()),
  serviceType: z.string(),
  cnames: z.array(z.string()).optional(),
  aValues: z.array(z.string()).optional(),
  conflicts: z.array(z.any()),
  acceptedChallenges: z.array(z.string()),
  misconfigured: z.boolean(),
});

/**
 * Fetches Vercel's recommended DNS configuration for a domain.
 *
 * @param hostname - The hostname to check.
 * @returns The DNS configuration advice.
 */
export async function getDomainConfig(
  hostname: string
): Promise<z.infer<typeof DomainConfigSchema>> {
  const endpoint = `/v6/domains/${hostname}/config`;
  const response = await vercelApiFetcher(endpoint);
  return DomainConfigSchema.parse(response);
}
