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

export type Tree = {
  globals: Globals,
  pages: Page[],
}