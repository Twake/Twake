import { ConnectorFactory } from "./connector-factory";
import { Connector } from "./orm/connectors";
import Manager from "./orm/manager";
import Repository from "./orm/repository/repository";
import { CassandraConnectionOptions } from "./orm/connectors/cassandra/cassandra";
import { MongoConnectionOptions } from "./orm/connectors/mongodb/mongodb";
import { EntityTarget } from "./orm/types";
import { RepositoryManager } from "./orm/repository/manager";
import "reflect-metadata";
export default class DatabaseService {
  version = "1";
  private connector: Connector;
  private entityManager: RepositoryManager;

  constructor(readonly type: DatabaseType, private options: ConnectionOptions) {
    this.entityManager = new RepositoryManager(this);
  }

  getConnector(): Connector {
    if (this.connector) {
      return this.connector;
    }

    this.connector = new ConnectorFactory().create(this.type, this.options);

    return this.connector;
  }

  getManager(): Manager<unknown> {
    return new Manager<unknown>(this.connector);
  }

  getRepository<Entity>(
    table: string,
    entity: EntityTarget<Entity>
  ): Promise<Repository<Entity>> {
    return this.entityManager.getRepository(table, entity);
  }
}

export declare type ConnectionOptions =
  | MongoConnectionOptions
  | CassandraConnectionOptions;

export declare type DatabaseType = "mongodb" | "cassandra";
