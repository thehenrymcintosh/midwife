import { Entities } from "./Entity";

type Callback = (entity: any ) => void;

export class EntityList {
  private readonly entities: Entities;
  private readonly entityMap: Record<string, any>;

  constructor(entities: Entities) {
    this.entities = entities;
    this.proxy = this.proxy.bind(this);
    this.forEach = this.forEach.bind(this);
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
    const handler: ProxyHandler<any> = {
      get: (target, prop) => {
        const val = target[prop];
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
      }, 
    }
    return new Proxy(data, handler);
  }

  forEach(cb: Callback): void {
    const { proxy, entities } = this;
    entities.forEach(entity => {
      cb( proxy(entity.unwrap()) );
    });
  }

}