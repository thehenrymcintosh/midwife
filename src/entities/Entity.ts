export interface EntityMeta {
  outpath?: string,
  aliases: string[],
  _self: string,
  [k:string]: any 
}

interface ObjectWithMeta {
  _meta?: {
    outpath?: string,
    aliases?: string | string[],
  }
  [k:string]: any 
}

type AcceptibleEntities = string | Record<any, any> | number | string[] | number[] | Record<any, any>[];

export type Entities = Entity<any>[];

export class Entity<T extends AcceptibleEntities> { 
  private _meta: EntityMeta;
  private _data: T;

  constructor(id: string, rawloaded: T) {
    if ( typeof rawloaded === "undefined" ) throw new Error("Record cannot have undefined contents");
    if ( typeof rawloaded === "function" ) throw new Error("Record cannot have a funciton as contents");
    if ( rawloaded === null ) throw new Error("Record cannot have null contents");

    this._meta = { aliases: [id], _self: removeExtension(id) };
    this._data = rawloaded;

    const _meta = (rawloaded as ObjectWithMeta)._meta;
    if ( typeof _meta !== "undefined" ) {
      const { aliases, outpath, ...rest } = _meta;
      Object.assign(this._meta, rest);
      if ( typeof outpath === "string" ) this._meta.outpath = outpath;
      if ( Array.isArray(aliases) ) {
        this._meta.aliases = this._meta.aliases.concat(aliases);
      } else if (typeof aliases === "string") {
        this._meta.aliases.push(aliases);
      }
    }

    this._meta = replaceSelf(this._meta._self, this._meta);
    this._data = replaceSelf(this._meta._self, this._data);
  }

  unwrap(): T {
    return this._data;
  }

  aliases(): string[] {
    return this._meta.aliases;
  }

  outpath(): string | undefined {
    return this._meta.outpath;
  }

  meta(): EntityMeta {
    return this._meta;
  }
  
}

function replaceSelf<T>(self: string, object: T): T {
  return recursiveVisit(object, (t) => t.replace(/__SELF/, self));
}

type visit<T> = (arg0: T) => T

function recursiveVisit<I>(o: I, cb: visit<string>): any {
  if (Array.isArray(o)) {
    return o.map( val => recursiveVisit(val, cb));
  } else if (typeof o === "object") {
    const newObject: Record<any, any> = {};
    Object.entries(o).forEach(([key, val]) => newObject[key] = recursiveVisit(val, cb));
    return newObject;
  } else if (typeof o === "string") {
    return cb(o);
  } else {
    return o;
  }
}

function removeExtension(path: string): string {
  const parts = path.split("/");
  const last = parts.pop();
  if (last) {
    const sliceidx = last.lastIndexOf(".");
    if (sliceidx > 0) {
      parts.push(last.slice(0, sliceidx));
    }
  }
  return parts.join("/");
}