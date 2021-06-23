import { Entities } from "./Entity";

export interface LoaderPlugin {
  accepts(filename: string): boolean,
  load( file: string ) : Promise<any>,
}

export interface ModifierPlugin {
  modify( entities: Entities ) : Promise<Entities>,
}

export interface RenderPlugin {
  render( entities: Entities, viewsDir: string, outDir: string, ) : Promise<null>,
}

export interface Plugin extends LoaderPlugin, ModifierPlugin, RenderPlugin {}

export type AllPluginTypes = Plugin | LoaderPlugin | ModifierPlugin | RenderPlugin;

export const PluginGuards = {
  isLoader: (plugin: AllPluginTypes) : plugin is LoaderPlugin => {
    return typeof (plugin as LoaderPlugin).accepts === "function" && typeof (plugin as LoaderPlugin).load === "function"
  },
  isModifier: (plugin: AllPluginTypes) : plugin is ModifierPlugin => typeof (plugin as ModifierPlugin).modify === "function",
  isRender: (plugin: AllPluginTypes) : plugin is RenderPlugin => typeof (plugin as RenderPlugin).render === "function",
}