import { Builder } from "./Builder";
import { InputConfig } from "./entities/Config";
import { LoaderPlugin, ModifierPlugin, RenderPlugin, Plugin, AllPluginTypes } from "./entities/Plugin";
import { EntityList } from "./entities/EntityList";

export async function build( config: InputConfig ) {
  console.log(config);
  const builder = new Builder(config);
  await builder.build();
  console.log("Build Complete.");
}

export {
  LoaderPlugin, 
  ModifierPlugin, 
  RenderPlugin, 
  Plugin, 
  AllPluginTypes,
  EntityList,
}