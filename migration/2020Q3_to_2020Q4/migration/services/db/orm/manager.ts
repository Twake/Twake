/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import _ from "lodash";
import { Connector } from "./connectors";
import { getEntityDefinition, unwrapPrimarykey } from "./utils";
import { v4 as uuidv4, v1 as uuidv1 } from "uuid";

export default class EntityManager<EntityType extends Record<string, any>> {
  private toPersist: EntityType[] = [];
  private toRemove: EntityType[] = [];

  constructor(readonly connector: Connector) {}

  public persist(entity: any): this {
    if (
      !entity.constructor.prototype._entity ||
      !entity.constructor.prototype._columns
    ) {
      throw Error("Cannot persist this object: it is not an entity.");
    }

    // --- Generate ids on primary keys elements (if not defined) ---
    const { columnsDefinition, entityDefinition } = getEntityDefinition(entity);
    const primaryKey: string[] = unwrapPrimarykey(entityDefinition);

    primaryKey.forEach((pk) => {
      if (entity[pk] === undefined) {
        const definition = columnsDefinition[pk];

        //Create default value
        switch (definition.options.generator || definition.type) {
          case "uuid":
            entity[pk] = uuidv4();
            break;
          case "timeuuid":
            entity[pk] = uuidv1();
            break;
          case "number":
            entity[pk] = 0;
            break;
          default:
            entity[pk] = "";
        }
      }
    });

    this.toPersist = this.toPersist.filter((e) => e !== entity);
    this.toPersist.push(_.cloneDeep(entity));

    return this;
  }

  public remove(entity: EntityType, entityType?: EntityType): this {
    if (entityType) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      entity = _.merge(new (entityType as any)(), entity);
    }
    if (
      !entity.constructor.prototype._entity ||
      !entity.constructor.prototype._columns
    ) {
      throw Error("Cannot remove this object: it is not an entity.");
    }
    this.toRemove = this.toRemove.filter((e) => e !== entity);
    this.toRemove.push(_.cloneDeep(entity));

    return this;
  }

  public async flush(): Promise<this> {
    await this.connector.upsert(this.toPersist);
    await this.connector.remove(this.toRemove);

    return this;
  }

  public reset(): void {
    this.toPersist = [];
    this.toRemove = [];
  }
}
