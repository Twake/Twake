import {
  DeleteResult,
  ListResult,
  SaveResult,
  OperationType,
} from "../../../../core/platform/framework/api/crud-service";
import {
  ChannelThreadUsers,
  ChannelThreadUsersPrimaryKey,
  ChannelThreadUsersType,
} from "../../entities";
import { DatabaseServiceAPI } from "../../../../core/platform/services/database/api";
import { ChannelThreadUsersServiceAPI } from "../../api";
import Repository from "../../../../core/platform/services/database/services/orm/repository/repository";

export class ChannelThreadUsersService implements ChannelThreadUsersServiceAPI {
  version: "1";
  repository: Repository<ChannelThreadUsers>;

  constructor(private database: DatabaseServiceAPI) {}

  async init(): Promise<this> {
    this.repository = await this.database.getRepository<ChannelThreadUsers>(
      ChannelThreadUsersType,
      ChannelThreadUsers,
    );

    return this;
  }

  async bulkSave(entities: ChannelThreadUsers[]): Promise<SaveResult<ChannelThreadUsers[]>> {
    await this.repository.saveAll(entities);

    return new SaveResult(ChannelThreadUsersType, entities, OperationType.CREATE);
  }

  async get(pk: ChannelThreadUsersPrimaryKey): Promise<ChannelThreadUsers> {
    return await this.repository.findOne(pk);
  }

  async delete(pk: ChannelThreadUsersPrimaryKey): Promise<DeleteResult<ChannelThreadUsers>> {
    await this.repository.remove(pk as ChannelThreadUsers);

    return new DeleteResult(ChannelThreadUsersType, pk as ChannelThreadUsers, true);
  }

  list(): Promise<ListResult<ChannelThreadUsers>> {
    throw new Error("Not implemented");
  }

  async getUsersInThread(
    pk: ChannelThreadUsersPrimaryKey,
  ): Promise<ListResult<ChannelThreadUsers>> {
    if (!pk.company_id || !pk.channel_id || !pk.thread_id) {
      throw new Error("Missing required fields");
    }
    return this.repository.find(pk);
  }
}
