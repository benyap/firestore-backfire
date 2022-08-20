export interface LoggingOptions {
  /**
   * If `true`, print debug level messages and higher.
   */
  debug?: boolean | undefined;

  /**
   * If `true`, print verbose level messages and higher.
   * Takes precendence over {@link debug}.
   */
  verbose?: boolean | undefined;

  /**
   * If `true`, all log messages are supressed.
   * Takes precendence over {@link verbose} and {@link debug}.
   */
  quiet?: boolean | undefined;
}
