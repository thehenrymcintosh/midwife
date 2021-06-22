import { LoaderPlugin } from "../types/Plugin";
import { RawLoadable } from "../types/Loadable";
import fs from "fs";
import marked from "marked";

export default class MarkdownPlugin implements LoaderPlugin {
  accepts(filename: string): boolean {
    return filename.endsWith(".md");
  }
  load(filename: string): Promise<RawLoadable> {
    return open(filename)
      .then((text) => {
        return {
          meta: {
            type: "record",
            alias: filename.replace(".md", ""),
          },
          data: {
            markdown: text,
            html: marked(text)
          }
        };
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
