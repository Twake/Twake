import { DatabaseType } from "../..";
import { CassandraConnectionOptions } from "./cassandra/cassandra";
import { MongoConnectionOptions } from "./mongodb/mongodb";
import { ColumnDefinition, EntityDefinition } from "../types";
import { FindOptions } from "../repository/repository";
import { ListResult } from "../../crud-service";

export * from "./mongodb/mongodb";
export * from "./cassandra/cassandra";

export type UpsertOptions = {};

export type RemoveOptions = {};

export interface Connector {
  /**
   * Connect to the database
   */
  connect(): Promise<this>;

  /**
   * Get the type of connector
   */
  getType(): DatabaseType;

  /**
   * Drop data
   */
  drop(): Promise<this>;

  /**
   * Create table
   */
  createTable(
    entity: EntityDefinition,
    columns: { [name: string]: ColumnDefinition }
  ): Promise<boolean>;

  /**
   * Upsert
   * returns true if the object was created/updated, false otherwise
   */
  upsert(entities: any[]): Promise<boolean[]>;

  /**
   * Remove
   * returns true if the object was removed, false otherwise
   */
  remove(entities: any[]): Promise<boolean[]>;

  /**
   * Find items in database
   * returns the list of entities matching the filters and options.
   */
  find<EntityType>(
    entityType: any,
    filters: any,
    options: FindOptions
  ): Promise<ListResult<EntityType>>;
}

export declare type ConnectionOptions =
  | MongoConnectionOptions
  | CassandraConnectionOptions;
