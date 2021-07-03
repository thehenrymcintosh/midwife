import { AllPluginTypes }from "./Plugin";
import path from "path";
import fs from "fs";

const NODE_ENV = process.env['NODE_ENV'];

export interface InputConfig {
  mode?: string,
  dataDir?: string,
  viewsDir?: string,
  outDir?: string,
  refPrefix?: string,
  plugins?: AllPluginTypes[],
}
export class Config {
  readonly mode: "development" | "test" | "production";
  readonly dataDir: string;
  readonly viewsDir: string;
  readonly outDir: string;
  readonly refPrefix: string;
  readonly plugins: AllPluginTypes[];

  constructor(config: InputConfig) {
    const cwd = process.cwd();
    this.mode = toEnv(config.mode) || toEnv(NODE_ENV) || "development";
    this.dataDir = path.resolve(cwd, config.dataDir || "./data");
    this.viewsDir = path.resolve(cwd, config.viewsDir || "./views");
    this.outDir = path.resolve(cwd, config.outDir || "./dist");
    if ( !fs.existsSync(this.dataDir) ) throw new Error(`Data directory does not exist at ${this.dataDir}`);
    if ( !fs.existsSync(this.viewsDir) ) throw new Error(`View directory does not exist at ${this.viewsDir}`);
    if ( !fs.existsSync(this.outDir) ) throw new Error(`Output directory does not exist at ${this.outDir}`);
    this.plugins = config.plugins || [];
    this.refPrefix = typeof config.refPrefix !== "undefined" ? config.refPrefix : "#";
  }
}

function toEnv(e?: string) {
  if (e === "production" || e === "development" || e === "test" ) {
    return e;
  }
  return;
}