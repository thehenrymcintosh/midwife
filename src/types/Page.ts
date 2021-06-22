import { Loadable, LoadableType, RawLoadable } from "./Loadable"; 
import { Printable } from "./Printable";

type PlainObject = {
  [k:string]: any 
};


interface PageMeta {
  filePath: string,
}

export class Page implements Loadable, Printable {
  private readonly meta: PageMeta;
  private readonly data: PlainObject;

  constructor(filePath: string, page: RawLoadable) {
    this.path = this.path.bind(this);
    this.unwrap = this.unwrap.bind(this);
    this.type = this.type.bind(this);
    this.visit = this.visit.bind(this);
    this.meta = {
      filePath: filePath,
      ...page.meta,
    };
    this.data = {...page.data};
  }

  path(): string {
    return this.meta.filePath;
  }

  unwrap(): PlainObject {
    return this.data;
  }
    
  type(): LoadableType {
    return LoadableType.Page;
  }

  visit(cb: visit): Page {
    const meta = this.meta;
    const data: PlainObject = recursiveVisit(this.data, cb);
    return new Page(this.path(), {meta, data});
  }
  
  print(): string {
    return `{ meta: ${JSON.stringify(this.meta, null, 2)}, data: ${JSON.stringify(this.data, null, 2)} }`
  }
}

type visit = (arg0: any) => any

function recursiveVisit(o: any, cb: visit): any {
  if (Array.isArray(o)) {
    return o.map( val => recursiveVisit(val, cb));
  } else if (typeof o === "object") {
    const newObject: PlainObject = {};
    Object.entries(o).forEach(([key, val]) => newObject[key] = recursiveVisit(val, cb));
    return newObject;
  } else if (typeof o !== "undefined" && typeof o !== "function" ) {
    return cb(o);
  }
}