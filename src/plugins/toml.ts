import toml from "toml";
import { LoaderPlugin } from "../types/Plugin";
import { Page } from "../types/Page";
import fs from "fs";

export default class TomlPlugin implements LoaderPlugin {
  accepts(filename: string): boolean {
    return filename.endsWith(".toml");
  }
  load(filename: string): Promise<Page> {
    return open(filename)
      .then((text) => {
        return toml.parse(text) as Page
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
