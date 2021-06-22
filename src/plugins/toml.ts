import toml from "toml";
import { LoaderPlugin } from "../types/Plugin";
import { RawLoadable } from "../types/Loadable";
import fs from "fs";

export default class TomlPlugin implements LoaderPlugin {
  accepts(filename: string): boolean {
    return filename.endsWith(".toml");
  }
  load(filename: string): Promise<RawLoadable> {
    return open(filename)
      .then((text) => {
        if (filename.endsWith(".record.toml")) {
          return toml.parse(text) as RawLoadable
        }
        return {
          data: toml.parse(text),
        }
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
