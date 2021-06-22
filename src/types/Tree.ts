import { Page } from "./Page";
import { Record } from "./Record";
import { Printable } from "./Printable";

type PlainObject = {
  [k:string]: any 
};

export type Globals = PlainObject;

type visit = (arg0: any) => any



export class Tree implements Printable {
  readonly globals: Globals;
  readonly pages: Page[];
  readonly records: Record[];

  constructor(globals: Globals, pages: Page[], records: Record[]) {
    this.globals = globals;
    this.pages = pages;
    this.records = records;
  }

  visitGlobals(cb: visit): Globals {
    return recursiveVisit(this.globals, cb);
  }

  visitPages(cb: visit): Page[]{
    return this.pages.map(page => page.visit(cb));
  }

  populate(): Tree {
    const populatedPages = this.visitPages(( val: any ) => {
      if (typeof val !== "string") return val;
      const record = this.records.find( record => record.matches(val) );
      if (!record) return val;
      return record.unwrap();
    });
    return new Tree(this.globals, populatedPages, this.records);
  }

  print(): string {
    return `
Globals: ${JSON.stringify(this.globals, null, 2)},
Pages: 
${this.pages.map(page => page.print()).join(",\n")}

Records: 
${this.records.map(record => record.print()).join(",\n")}
`
  }
}


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