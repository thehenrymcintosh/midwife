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
  private readonly prefix: string;

  constructor(entities: Entities, prefix: string) {
    this.entities = entities;
    this.prefix = prefix;
    this.proxy = this.proxy.bind(this);
    this.toProxiedEntity = this.toProxiedEntity.bind(this);
    this.getEntityByRef = this.getEntityByRef.bind(this);
    this.forEach = this.forEach.bind(this);
    this.map = this.map.bind(this);
    this.filter = this.filter.bind(this);
    const entityMap: Record<string, any> = {};
    this.entities.forEach(e => {
      e.aliases()
      .forEach(alias => {
        if ( entityMap[alias] ) throw new Error(`Duplicate entity alias: "${alias}". Aliases must be unique!`);
        entityMap[alias] = e.unwrap();
      })
    });
    this.entityMap = entityMap;
  }

  private getEntityByRef(val: any): any {
    const { prefix, entityMap } = this;
    if (typeof val !== "string") return val;
    if (!val.startsWith(prefix)) return val;
    const key = val.slice(prefix.length);
    if (entityMap[key]) return entityMap[key];
    return val;
  }

  private proxy<T>(data: T): T {
    const { proxy,  getEntityByRef } = this;
    if (typeof data !== "object") return data;

    function getValue(val: any) {
      const returnValue = getEntityByRef(val);
      if (typeof returnValue === "object" && returnValue !== null) {
        return proxy(returnValue);
      } else {
        return returnValue;
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
