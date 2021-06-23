import { RenderPlugin } from "../entities/Plugin";
import { Tree } from "../entities/Tree";
import { Liquid } from "liquidjs";
import fs from "fs";
import path from "path";

export default class LiquidPlugin implements RenderPlugin {
  render(tree: Tree, viewsDir: string, outDir: string): Promise<null> {
    const engine = new Liquid({ root: viewsDir, extname: ".liquid" });
    const { pages, globals } = tree;

    return Promise.all(
      pages.map(page => {
        const outPath = changeExtension(path.join(outDir, page.path()), ".html");
        engine.renderFile("app", {globals, page: page.unwrap() })
          .then(output => write(outPath, output) )
      })
    )
    .then(() => null);
  }
}

function changeExtension(file: string, extension: string) {
  const basename = path.basename(file, path.extname(file))
  return path.join(path.dirname(file), basename + extension)
}

function write(filename: string, data: string ) : Promise<null> {
  return new Promise( (resolve, reject) => {
    fs.mkdir(path.dirname(filename), { recursive: true }, (err) => {
      if (err) return reject(err);
      fs.writeFile(filename, data, {}, (err) =>  {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      })
    });
  })
}