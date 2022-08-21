import {
  IDataSourceReader,
  IDataSourceWriter,
  DataSourceOptions,
} from "../interface";
import {
  DataSourceNotImplementedError,
  NoMatchingDataSourceError,
} from "../errors";

/**
 * Defines how a data source reader or writer should be created.
 */
export type IDataSourceCreator<
  T extends IDataSourceReader | IDataSourceWriter,
  CustomOptions = { [key: string]: any }
> =
  | {
      /**
       * Provide a class that implements {@link IDataSourceReader}
       * or {@link IDataSourceWriter} that will be instantiated
       * when required.
       */
      useClass: new (
        path: string,
        options: DataSourceOptions & CustomOptions
      ) => T;
      useFactory?: never;
    }
  | {
      /**
       * Provide a function that returns a {@link IDataSourceReader}
       * or {@link IDataSourceWriter} when required.
       */
      useFactory: (
        path: string,
        options: DataSourceOptions & CustomOptions
      ) => Promise<T>;
      useClass?: never;
    };

/**
 * A data source allows `firestore-backfire` to import or export
 * data to an external storage location. This interface defines
 * when a data source should be used, and how to create a reader
 * or writer.
 *
 * @template T The expected options to be available when creating
 *             a reader or a writer.
 */
export interface IDataSource<T extends { [key: string]: any } = {}> {
  /**
   * A unique identifier for the data source.
   */
  id: string;

  /**
   * A function that should return `true` when a data path
   * is compatible with this data source.
   *
   * For example, a data source that reads and writes data
   * using AWS S3 might check that a path begins with `s3://`.
   */
  match?: (path: string) => boolean;

  /**
   * Defines how a {@link IDataSourceReader} should be created
   * for this data source.
   */
  reader?: IDataSourceCreator<IDataSourceReader, T>;

  /**
   * Defines how a {@link IDataSourceWriter} should be created
   * for this data source.
   */
  writer?: IDataSourceCreator<IDataSourceWriter, T>;
}

/**
 * Keeps track of data sources to import and export data with.
 *
 * In most cases, you should not need to instantiate this class
 * yourself. Use the default instance that is created for you
 * through the `dataSourceFactory` export.
 */
export class DataSourceFactory<DefaultOptions = DataSourceOptions> {
  private sources: { [id: string]: IDataSource<any> } = {};

  /**
   * @param defaultDataSource
   */
  constructor(private defaultDataSource?: IDataSource<DefaultOptions>) {
    if (defaultDataSource) this.register(defaultDataSource);
  }

  /**
   * Register a data source. If a data source with the same `id`
   * exists, it will be overwritten.
   */
  register<T extends { [key: string]: any }>(dataSource: IDataSource<T>): void {
    this.sources[dataSource.id] = dataSource;
  }

  /**
   * Get a list of registered data sources.
   */
  getRegistrations(): IDataSource<any>[] {
    return Object.values(this.sources);
  }

  /**
   * Get the first compatible data source for the given data path.
   * If no matches are found, the default data source is returned
   * if one was registered when the factory was created. Otherwise,
   * a {@link NoMatchingDataSourceError} is thrown.
   *
   * If you need to use a specific data source, you might want to
   * use {@link getDataSourceById()} instead.
   *
   * @param path The data path.
   */
  getDataSource(path: string): IDataSource<any> {
    for (const id in this.sources) {
      const dataSource = this.sources[id]!;
      if (!dataSource.match?.(path)) continue;
      return dataSource;
    }
    if (this.defaultDataSource) return this.defaultDataSource;
    throw new NoMatchingDataSourceError(path);
  }

  /**
   * Get a data source by its id.
   *
   * @param id The `id` of the data source to get.
   */
  getDataSourceById(id: string): IDataSource<any> | undefined {
    return this.sources[id];
  }

  /**
   * Create a data source reader for the specified path.
   *
   * @param path The data path to read data from.
   * @param options The options to use when creating the reader.
   */
  async createReader<T extends { [key: string]: any }>(
    path: string,
    options: DefaultOptions & T
  ): Promise<IDataSourceReader> {
    const { id, reader } = this.getDataSource(path);
    if (!reader) throw new DataSourceNotImplementedError(id, "reader");
    if ("useClass" in reader) return new reader.useClass(path, options);
    if ("useFactory" in reader) return await reader.useFactory(path, options);
    throw new DataSourceNotImplementedError(id, "reader");
  }

  /**
   * Create a data source writer for the specified path.
   *
   * @param path The data path to write data tp.
   * @param options The options to use when creating the writer.
   */
  async createWriter<T extends { [key: string]: any }>(
    path: string,
    options: DefaultOptions & T
  ): Promise<IDataSourceWriter> {
    const { id, writer } = this.getDataSource(path);
    if (!writer) throw new DataSourceNotImplementedError(id, "writer");
    if ("useClass" in writer) return new writer.useClass(path, options);
    if ("useFactory" in writer) return await writer.useFactory(path, options);
    throw new DataSourceNotImplementedError(id, "writer");
  }
}
