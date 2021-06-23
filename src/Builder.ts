import { Config, InputConfig } from "./entities/Config";
import { PluginGuards, LoaderPlugin } from "./entities/Plugin";
import glob from "glob";
import path from "path";
import { Entity, Entities } from "./entities/Entity";

export class Builder {
  private readonly config : Config;

  constructor( config : InputConfig ) {
    this.config = new Config(config);
    this.runLoadPlugin = this.runLoadPlugin.bind(this);
    this.runLoadPlugins = this.runLoadPlugins.bind(this);
    this.runModifyPlugins = this.runModifyPlugins.bind(this);
    this.runExportPlugins = this.runExportPlugins.bind(this);
  }

  async build(): Promise<null> {
    const initialEntities = await this.runLoadPlugins();
    const entities = await this.runModifyPlugins( initialEntities );
    return this.runExportPlugins(entities);
  }

  private async runLoadPlugins() : Promise<Entities> {
    const {config, runLoadPlugin} = this;
    const files = await this.getDataFiles()
    const loaders = config.plugins
      .filter( PluginGuards.isLoader )
      .map( plugin => runLoadPlugin(plugin, files) );
    return ( await Promise.all( loaders )).reduce(flatten, []);
  }

  private async runModifyPlugins(prevEntities: Entities) : Promise<Entities> {
    const { plugins } = this.config;
    const modPlugins = plugins.filter( PluginGuards.isModifier );
    let entities = prevEntities;
    for (const plugin of modPlugins) {
      entities = await plugin.modify(entities);
    }
    return entities;
  }

  private async runExportPlugins(entities: Entities) : Promise<null> {
    const { plugins, viewsDir, outDir } = this.config;
    return Promise.all( 
      plugins
        .filter( PluginGuards.isRender )
        .map( plugin => plugin.render(entities, viewsDir, outDir) )
    ).then( () => null );
  }

  private runLoadPlugin(plugin: LoaderPlugin, filePaths: string[]): Promise<Entities> {
    const {dataDir} = this.config;
    return Promise.all(
      filePaths
        .filter(filePath => plugin.accepts(filePath))
        .map(filePath => 
          plugin
            .load(filePath)
            .then(pluginResponse => {
              const relpath = path.relative(dataDir, filePath);
              return new Entity(relpath, pluginResponse);
            })
        )
    );
  }
  
  private getDataFiles() : Promise<string[]> {
    const globOptions = {
      cwd: this.config.dataDir,
      absolute: true,
      nodir: true,
      matchBase: true,
    };
    return new Promise( (resolve, reject) => {
      glob("./**/*", globOptions , (error, paths) => {
        if ( error ) return reject(error);
        resolve(paths);
      });
    });
  }

}

function flatten<T>(acc: T[], current: T[]) {
  return acc.concat(current);
}