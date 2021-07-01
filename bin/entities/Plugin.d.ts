import { Entities } from "./Entity";
import { EntityList } from "./EntityList";
export interface LoaderPlugin {
    accepts(filename: string): boolean;
    load(file: string): Promise<any>;
}
export interface ModifierPlugin {
    modify(entities: Entities): Promise<Entities>;
}
export interface RenderPlugin {
    render(entities: EntityList, viewsDir: string, outDir: string): Promise<null>;
}
export interface Plugin extends LoaderPlugin, ModifierPlugin, RenderPlugin {
}
export declare type AllPluginTypes = Plugin | LoaderPlugin | ModifierPlugin | RenderPlugin;
export declare const PluginGuards: {
    isLoader: (plugin: AllPluginTypes) => plugin is LoaderPlugin;
    isModifier: (plugin: AllPluginTypes) => plugin is ModifierPlugin;
    isRender: (plugin: AllPluginTypes) => plugin is RenderPlugin;
};
//# sourceMappingURL=Plugin.d.ts.map