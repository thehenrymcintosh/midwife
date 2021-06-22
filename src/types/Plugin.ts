import { Tree } from "./Tree";
import { RawLoadable } from "./Loadable";

export interface LoaderPlugin {
  accepts(filename: string): boolean,
  load( file: string ) : Promise<RawLoadable>,
}

export interface ModifierPlugin {
  modify( tree: Tree ) : Promise<Tree>,
}

export interface RenderPlugin {
  render( tree: Tree, viewsDir: string, outDir: string, ) : Promise<null>,
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