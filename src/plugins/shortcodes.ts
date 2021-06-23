import { ModifierPlugin } from "../entities/Plugin";

type shortcode = {
  text: string,
  callback: () => string,
}
export default class ShortcodePlugin implements ModifierPlugin {
  codes: shortcode[]

  constructor(codes: shortcode[]) {
    this.codes = codes;
  }
  modify(tree: Tree) : Promise<Tree> {
    const pages = tree.visitPages( ( val ) => this.replaceShortcode(val) );
    const newTree = new Tree(tree.globals, pages, tree.records);
    return Promise.resolve(newTree);
  }

  private replaceShortcode(value: any) {
    if (typeof value !== "string") return value;
    let temp = value;
    this.codes.forEach(code => {
      const rx = new RegExp(`\\[${code.text}\\]`);
      temp = temp.replace(rx, code.callback() );
    })
    return temp;
  }
}

