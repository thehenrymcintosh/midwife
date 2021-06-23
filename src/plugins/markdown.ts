import { LoaderPlugin } from "../entities/Plugin";
import fs from "fs";
import marked from "marked";

export default class MarkdownPlugin implements LoaderPlugin {
  accepts(filename: string): boolean {
    return filename.endsWith(".md");
  }
  load(filename: string): Promise<string> {
    return open(filename)
      .then((text) => {
        return marked(text);
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
