/**
 * Returns a promise that resolves after the specified amount of time.
 *
 * @param ms The time in ms to wait.
 */
export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
