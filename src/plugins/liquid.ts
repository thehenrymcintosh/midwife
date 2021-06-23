import { RenderPlugin } from "../entities/Plugin";
import { Liquid } from "liquidjs";
import fs from "fs";
import path from "path";
import { EntityList } from "src/entities/EntityList";

export default class LiquidPlugin implements RenderPlugin {
  render(entities: EntityList, viewsDir: string, outDir: string): Promise<null> {
    const engine = new Liquid({ root: viewsDir, extname: ".liquid" });

    return Promise.all(
      entities
      .map(({meta, data}) => {
        if (!meta.outpath) return Promise.resolve();
        const outPath = changeExtension(path.join(outDir, meta.outpath), ".html");
        const template = meta['template'] || "app";
        return engine.renderFile(template, data)
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