import { initializeDatabase } from '$lib/server/database';

/**
 * Initialize the database when the server starts.
 * Ensures that necessary tables and sequences are created.
 */
initializeDatabase();
/**
 * SvelteKit's handle hook:
 * - This function processes every request before it reaches the route handler.
 * - Can be used for authentication, logging, headers modification, etc.
 */

export async function handle({ event, resolve }) {
  return resolve(event);
}