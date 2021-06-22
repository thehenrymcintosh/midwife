import { Config, InputConfig } from "./types/Config";
import { Page } from "./types/Page";
import { PluginGuards, LoaderPlugin } from "./types/Plugin";
import glob from "glob";
import path from "path";
import { Loadable, LoadGuards } from "./types/Loadable";
import { Record } from "./types/Record";
import { Tree } from "./types/Tree";

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
    const { globals } = this.config;
    const loadables = await this.runLoadPlugins();
    const pages = loadables.filter(LoadGuards.isPage);
    const records = loadables.filter(LoadGuards.isRecord);
    const tree = await this.runModifyPlugins( new Tree(globals, pages, records) );

    return this.runExportPlugins(tree.populate());
  }

  private async runLoadPlugins() : Promise<Loadable[]> {
    const {config, runLoadPlugin} = this;
    const files = await this.getDataFiles()
    const loaders = config.plugins
      .filter( PluginGuards.isLoader )
      .map( plugin => runLoadPlugin(plugin, files) );
    return ( await Promise.all( loaders )).reduce(flatten, []);
  }

  private async runModifyPlugins(tree: Tree) : Promise<Tree> {
    const { plugins } = this.config;
    const modPlugins = plugins.filter( PluginGuards.isModifier );
    let outTree = tree;
    for (const plugin of modPlugins) {
      outTree = await plugin.modify(outTree);
    }
    return outTree;
  }

  private async runExportPlugins(tree: Tree) : Promise<null> {
    const { plugins, viewsDir, outDir } = this.config;
    return Promise.all( 
      plugins
        .filter( PluginGuards.isRender )
        .map( plugin => plugin.render(tree, viewsDir, outDir) )
    ).then( () => null );
  }

  private runLoadPlugin(plugin: LoaderPlugin, filePaths: string[]): Promise<Loadable[]> {
    const {dataDir} = this.config;
    return Promise.all(
      filePaths
        .filter(filePath => plugin.accepts(filePath))
        .map(filePath => 
          plugin
            .load(filePath)
            .then(loadable => {
              const relpath = path.relative(dataDir, filePath);
              if (loadable.meta && loadable.meta.type && loadable.meta.type === "record") {
                return new Record(relpath, loadable);
              }
              return new Page(relpath, loadable)
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