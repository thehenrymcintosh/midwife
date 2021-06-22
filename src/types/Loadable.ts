import { Record } from "./Record";
import { Page } from "./Page";

export enum LoadableType {
  Page,
  Record,
}

export interface Loadable {
  type(): LoadableType,
}

type PlainDataObject = {
  [k:string]: any 
};

type PlainMetaObject = {
  type?: "record" | "page",
  alias?: string[] | string,
  [k:string]: any 
};

export interface RawLoadable {
  meta?: PlainMetaObject,
  data?: PlainDataObject,
}

export const LoadGuards = {
  isRecord: (loadable: Loadable) : loadable is Record =>  loadable.type() === LoadableType.Record,
  isPage: (loadable: Loadable) : loadable is Page =>  loadable.type() === LoadableType.Page,
}