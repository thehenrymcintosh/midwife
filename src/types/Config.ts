import { AllPluginTypes }from "./Plugin";
import { Globals }from "./Page";

const NODE_ENV = process.env['NODE_ENV'];

export interface InputConfig {
  mode?: string,
  dataDir?: string,
  viewsDir?: string,
  globals?: Globals,
  outDir?: string,
  plugins?: AllPluginTypes[],
}

export interface Config {
  mode: "development" | "test" | "production",
  dataDir: string,
  viewsDir: string,
  globals: Globals,
  outDir: string,
  plugins: AllPluginTypes[],
}

export class Config {
  constructor(config: InputConfig) {
    this.globals = config.globals || {};
    this.mode = toEnv(config.mode) || toEnv(NODE_ENV) || "development";
    this.dataDir = config.dataDir || "./data";
    this.viewsDir = config.dataDir || "./views";
    this.outDir = config.outDir || "./dist";
    this.plugins = config.plugins || [];
  }
}

function toEnv(e?: string) {
  if (e === "production" || e === "development" || e === "test" ) {
    return e;
  }
  return;
}