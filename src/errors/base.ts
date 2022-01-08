/**
 * Base class for errors thrown by Backfire.
 */
export class BackfireError extends Error {
  constructor(message: string, public readonly details?: string) {
    super(message);
  }
}
