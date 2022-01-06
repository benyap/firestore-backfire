import { cpus } from "os";

/**
 * Returns the number of logical CPUs the machine has.
 */
export function getCPUCount(): number {
  return cpus().length;
}
