type PlainObject = {
  [k:string]: any 
};

interface InputPage { 
  meta?: PlainObject,
  body?: PlainObject,
}

export interface Page { 
  filePath: string,
  meta: PlainObject,
  body: PlainObject,
}

export class Page {
  constructor(page: InputPage, filePath: string) {
    this.meta = page.meta || {};
    this.body = page.body || {};
    this.filePath = filePath;
  }
}

export type Globals = PlainObject;

type visit = (arg0: any) => any

export class Tree {
  readonly globals: Globals;
  readonly pages: Page[];

  constructor(globals: Globals, pages: Page[]) {
    this.globals = globals;
    this.pages = pages;
  }

  visitGlobals(cb: visit): Globals {
    return recursiveVisit(this.globals, cb);
  }

  visitPages(cb: visit): Page[]{
    return recursiveVisit(this.pages, cb);
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