import toml from "toml";
import { LoaderPlugin } from "../entities/Plugin";
import fs from "fs";

export default class TomlPlugin implements LoaderPlugin {
  accepts(filename: string): boolean {
    return filename.endsWith(".toml");
  }
  load(filename: string): Promise<Record<any, any>> {
    return open(filename)
      .then((text) => {
        return toml.parse(text);
      })
  }
}

function open(filename: string ) : Promise<string> {
  return new Promise( (resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) =>  {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}
