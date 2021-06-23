import { EntityMeta, Entities, Entity } from "./Entity";


type ProxiedEntity = {
  meta: EntityMeta, 
  data: any, 
}

type ForEachCallback = (proxiedEntity: ProxiedEntity) => void;
type MapCallback<T> = (proxiedEntity: ProxiedEntity) => T;
type FilterCallback = (proxiedEntity: ProxiedEntity) => boolean;
export class EntityList {
  private readonly entities: Entities;
  private readonly entityMap: Record<string, any>;

  constructor(entities: Entities) {
    this.entities = entities;
    this.proxy = this.proxy.bind(this);
    this.toProxiedEntity = this.toProxiedEntity.bind(this);
    this.forEach = this.forEach.bind(this);
    this.map = this.map.bind(this);
    this.filter = this.filter.bind(this);
    const entityMap: Record<string, any> = {};
    this.entities.forEach(e => {
      e.aliases().forEach(alias => {
        if ( entityMap[alias] ) throw new Error(`Duplicate entity alias: "${alias}". Aliases must be unique!`);
        entityMap[alias] = e.unwrap();
      })
    });
    this.entityMap = entityMap;
  }

  private proxy<T>(data: T): T {
    const { entityMap, proxy } = this;
    if (typeof data !== "object") return data;

    function getValue(val: any) {
      if (typeof val === "string" && entityMap[val]) {
        if (typeof entityMap[val] === "object" && entityMap[val] !== null) {
          return proxy(entityMap[val]);
        } else {
          return entityMap[val];
        }
      } else if ( typeof val === "object" && val !== null) {
        return proxy(val);
      } else {
        return val;
      }
    }

    const handler: ProxyHandler<any> = {
      get: (target, prop) => {
        if (prop === Symbol.iterator) {
          return function*() {
            for (const e of Object.entries(target)) { 
              yield getValue(e[1]); 
            }
          }
        } 
        return getValue(target[prop]);
      }, 
    }
    return new Proxy(data, handler);
  }

  private toProxiedEntity(entity: Entity<any> ):ProxiedEntity {
    return {meta: entity.meta(), data: this.proxy(entity.unwrap()) };
  } 

  forEach(cb: ForEachCallback): void {
    const { toProxiedEntity, entities } = this;
    entities.forEach(entity => {
      cb( toProxiedEntity(entity) );
    });
  }

  map<T>(cb: MapCallback<T>): T[] {
    const { toProxiedEntity, entities } = this;
    return entities.map(entity => cb( toProxiedEntity(entity) ));
  }

  filter(cb: FilterCallback): ProxiedEntity[] {
    const { toProxiedEntity, entities } = this;
    return entities
      .map(e => toProxiedEntity(e))
      .filter(cb);
  }
}