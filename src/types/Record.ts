import { Loadable, LoadableType, RawLoadable } from "./Loadable"; 
import { Printable } from "./Printable";

type PlainObject = {
  [k:string]: any 
};

type Aliases = {
  [k:string]: true 
};

interface RecordMeta {
  aliases: Aliases,
}

export class Record implements Loadable, Printable { 
  private meta: RecordMeta;
  private data: PlainObject;

  constructor(id: string, rawloaded: RawLoadable) {
    this.meta = {
      aliases: { [id]: true } 
    };
    if (rawloaded.meta && rawloaded.meta.alias){
      const {alias} = rawloaded.meta;
      if (Array.isArray(alias)) {
        alias.forEach( al => { this.meta.aliases[al] = true })
      } else if (typeof alias === "string") {
        this.meta.aliases[alias] = true;
      }
    }
    this.data = { ...rawloaded.data };
  }

  matches(id: string) : boolean {
    return !!this.meta.aliases[id];
  }

  unwrap(): PlainObject {
    return this.data;
  }
  
  type(): LoadableType {
    return LoadableType.Record;
  }

  print(): string {
    return `{ meta: ${JSON.stringify(this.meta, null, 2)}, data: ${JSON.stringify(this.data, null, 2)} }`
  }
}
