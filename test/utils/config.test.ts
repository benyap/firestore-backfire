import { S3StorageSourceOptions } from "~/services/StorageSourceService/s3";
import { resolveConfig } from "~/utils/config";

describe(resolveConfig.name, () => {
  it("uses CLI path", () => {
    const config = resolveConfig("path");
    expect(config.path).toBe("path");
  });

  it("uses config path when CLI path is not available", () => {
    const config = resolveConfig("", {}, { path: "path" });
    expect(config.path).toBe("path");
  });

  it("chooses CLI path over config path", () => {
    const config = resolveConfig("path", {}, { path: "another" });
    expect(config.path).toBe("path");
  });

  it("resolves to correct path type", () => {
    expect(resolveConfig("path").type).toBe("local");
    expect(resolveConfig("gs://path").type).toBe("gs");
    expect(resolveConfig("s3://path").type).toBe("s3");
  });

  it("uses config emulator if no connection options are provided on the CLI", () => {
    const config = resolveConfig("path", {}, { emulator: "config" });
    expect(config.emulator).toBe("config");
  });

  it("chooses cli emulator over config emulator", () => {
    const config = resolveConfig(
      "path",
      { emulator: "cli" },
      { emulator: "config" }
    );
    expect(config.emulator).toBe("cli");
  });

  it("chooses cli keyfile over config keyfile", () => {
    const config = resolveConfig("path", { keyfile: "cli" }, { keyfile: "config" });
    expect(config.keyfile).toBe("cli");
  });

  it("chooses cli keyfile over config emulator", () => {
    const config = resolveConfig("path", { keyfile: "cli" }, { emulator: "config" });
    expect(config.keyfile).toBe("cli");
    expect(config.emulator).toBeUndefined();
  });

  it("uses config AWS profile when cli AWS access key or AWS secret is not available", () => {
    const config = resolveConfig(
      "s3://path",
      { awsAccessKeyId: "cli" },
      { awsProfile: "config" }
    );
    expect((config as S3StorageSourceOptions).awsProfile).toBe("config");
    expect((config as S3StorageSourceOptions).awsAccessKeyId).toBe("cli");
    expect((config as S3StorageSourceOptions).awsSecretAccessKey).toBeUndefined();
  });

  it("chooses cli profile over config AWS keys", () => {
    const config = resolveConfig(
      "s3://path",
      { awsProfile: "cli" },
      { awsAccessKeyId: "config", awsSecretAccessKey: "config" }
    );
    expect((config as S3StorageSourceOptions).awsProfile).toBe("cli");
    expect((config as S3StorageSourceOptions).awsAccessKeyId).toBeUndefined();
    expect((config as S3StorageSourceOptions).awsSecretAccessKey).toBeUndefined();
  });

  it("transforms string patterns into regexes", () => {
    const config = resolveConfig(
      "path",
      {},
      { patterns: ["hello", "^world"] as any[] }
    );
    expect(config.patterns?.every((p) => p instanceof RegExp)).toBe(true);
    expect(config.patterns).toMatchInlineSnapshot(`
      Array [
        /hello/,
        /\\^world/,
      ]
    `);
  });
});
