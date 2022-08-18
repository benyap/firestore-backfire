import { IDataReader, IDataWriter, DataSourceOptions } from "../interface";
import { DataSourceNotImplementedError } from "../errors";

export type DataSourceCreator<T> =
  | { useClass: new (path: string, options: DataSourceOptions) => T }
  | { useFactory: (path: string, options: DataSourceOptions) => Promise<T> };

export interface DataSourceRegistration {
  id: string;
  match?: (path: string) => boolean;
  reader?: DataSourceCreator<IDataReader>;
  writer?: DataSourceCreator<IDataWriter>;
}

export class DataSourceFactory {
  private sources: { [id: string]: DataSourceRegistration } = {};

  constructor(private defaultDataSource: DataSourceRegistration) {
    this.register(defaultDataSource);
  }

  register(registration: DataSourceRegistration) {
    this.sources[registration.id] = registration;
  }

  getDataSource(path: string) {
    for (const id in this.sources) {
      const dataSource = this.sources[id]!;
      if (!dataSource.match?.(path)) continue;
      return dataSource;
    }
    return this.defaultDataSource;
  }

  async createReader(
    path: string,
    options: DataSourceOptions
  ): Promise<IDataReader> {
    const { id, reader } = this.getDataSource(path);
    if (!reader) throw new DataSourceNotImplementedError(id, "reader");
    if ("useClass" in reader) return new reader.useClass(path, options);
    if ("useFactory" in reader) return await reader.useFactory(path, options);
    throw new DataSourceNotImplementedError(id, "reader");
  }

  async createWriter(
    path: string,
    options: DataSourceOptions
  ): Promise<IDataWriter> {
    const { id, writer } = this.getDataSource(path);
    if (!writer) throw new DataSourceNotImplementedError(id, "writer");
    if ("useClass" in writer) return new writer.useClass(path, options);
    if ("useFactory" in writer) return await writer.useFactory(path, options);
    throw new DataSourceNotImplementedError(id, "writer");
  }
}
