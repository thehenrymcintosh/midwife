import { ModifierPlugin } from "../types/Plugin";
import { Tree } from "../types/Page";



export default class ShortcodePlugin implements ModifierPlugin {
  agency: string;

  constructor(agency: string) {
    this.replaceShortcode = this.replaceShortcode.bind(this);
    this.agency = agency;
  }
  modify(tree: Tree) : Promise<Tree> {
    const newTree = new Tree(tree.globals, tree.visitPages( this.replaceShortcode ))
    return Promise.resolve(newTree);
  }

  private replaceShortcode(value: any) {
    if (typeof value !== "string") return value;
    return value.replace(/\[AGENCY_NAME\]/, this.agency);
  }
}

