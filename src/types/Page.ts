interface InputPage { 
  meta?: {
    [k:string]: any 
  },
  body?: {
    [k:string]: any 
  },
}

export interface Page { 
  filePath: string,
  meta: {
    [k:string]: any,
  },
  body: {
    [k:string]: any,
  },
}

export class Page {
  constructor(page: InputPage, filePath: string) {
    this.meta = page.meta || {};
    this.body = page.body || {};
    this.filePath = filePath;
  }
}

export type Globals = { 
  [k:string]: any 
}

export type Tree = {
  globals: Globals,
  pages: Page[],
}