/**
 * DNS Check Utility
 *
 * This utility provides a set of functions for performing DNS lookups.
 * It uses Node's built-in dns/promises module to perform the lookups.
 * These checks are intended to be run on the server-side, for example in a server
 * action or a background job.
 *
 * @see https://nodejs.org/api/dns.html#dnspromises-api
 */
import { promises as dns } from 'dns';

const DNS_TIMEOUT = 5000; // 5 seconds

/**
 * A wrapper for dns.resolve that adds a timeout.
 *
 * @param hostname - The hostname to resolve.
 * @param rrtype - The resource record type to resolve.
 * @returns The resolved records.
 */
async function resolveWithTimeout(
  hostname: string,
  rrtype: string
): Promise<any[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DNS_TIMEOUT);

  try {
    const records = await dns.resolve(hostname, rrtype);
    return Array.isArray(records) ? records : [records];
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`DNS lookup for ${hostname} (${rrtype}) timed out`);
    }
    // Return empty array for NXDOMAIN, NODATA, etc.
    if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
      return [];
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Looks up CNAME records for a given hostname.
 *
 * @param hostname - The hostname to look up.
 * @returns An array of CNAME records.
 */
export async function lookupCNAME(hostname: string): Promise<string[]> {
  const records = await resolveWithTimeout(hostname, 'CNAME');
  return records.map(record => record.value);
}

/**
 * Looks up TXT records for a given hostname.
 *
 * @param hostname - The hostname to look up.
 * @returns An array of TXT records.
 */
export async function lookupTXT(hostname: string): Promise<string[]> {
  const records = await resolveWithTimeout(hostname, 'TXT');
  // Flatten the array of arrays of strings into a single array of strings
  return records.flatMap(record => record.entries);
}

/**
 * Looks up A records for a given hostname.
 *
 * @param hostname - The hostname to look up.
 * @returns An array of A records (IP addresses).
 */
export async function lookupA(hostname: string): Promise<string[]> {
  const records = await resolveWithTimeout(hostname, 'A');
  return records.map(record => record.address);
}

/**
 * Performs an HTTP health check on a given hostname.
 * It attempts to fetch a well-known URL and expects a 200 OK response.
 *
 * @param hostname - The hostname to check.
 * @returns True if the health check passes, false otherwise.
 */
export async function httpCheck(hostname: string): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DNS_TIMEOUT);

  try {
    const response = await fetch(`https://${hostname}/.well-known/folio-health`, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
    });
    return response.ok;
  } catch (error) {
    console.error(`HTTP check for ${hostname} failed`, error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
