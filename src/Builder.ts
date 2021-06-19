import { Config, InputConfig } from "./types/Config";
import { Page, Tree } from "./types/Page";
import { Guards, LoaderPlugin } from "./types/Plugin";
import glob from "glob";
import path from "path";

export class Builder {
  private readonly config : Config;

  constructor( config : InputConfig ) {
    this.config = new Config(config);
    this.runLoadPlugin = this.runLoadPlugin.bind(this);
    this.getDataFiles = this.getDataFiles.bind(this);
    this.export = this.export.bind(this);
  }

  async build(): Promise<null> {
    const { globals } = this.config;
    const pages = await this.readPages();
    const tree : Tree = {
      globals,
      pages,
    }
    return this.export(tree);
  }

  private async readPages() : Promise<Page[]> {
    const {config, runLoadPlugin} = this;
    const files = await this.getDataFiles()
    const loaders = config.plugins
      .filter( Guards.isLoader )
      .map( plugin => runLoadPlugin(plugin, files) );
    return ( await Promise.all( loaders )).reduce(flatten, []);
  }

  private async export(tree: Tree) : Promise<null> {
    const { plugins, viewsDir, outDir } = this.config;
    return Promise.all( 
      plugins
        .filter( Guards.isRender )
        .map( plugin => plugin.render(tree, viewsDir, outDir) )
    ).then( () => null );
  }

  private runLoadPlugin(plugin: LoaderPlugin, filePaths: string[]): Promise<Page[]> {
    const {dataDir} = this.config;
    return Promise.all(
      filePaths
        .filter(filePath => plugin.accepts(filePath))
        .map(filePath => 
          plugin
            .load(filePath)
            .then(page => new Page(page, path.relative(dataDir, filePath)))
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