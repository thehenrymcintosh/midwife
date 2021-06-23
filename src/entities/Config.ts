import { AllPluginTypes }from "./Plugin";
import path from "path";

const NODE_ENV = process.env['NODE_ENV'];

export interface InputConfig {
  mode?: string,
  dataDir?: string,
  viewsDir?: string,
  outDir?: string,
  plugins?: AllPluginTypes[],
}

export interface Config {
  mode: "development" | "test" | "production",
  dataDir: string,
  viewsDir: string,
  outDir: string,
  plugins: AllPluginTypes[],
}

export class Config {
  constructor(config: InputConfig) {
    const cwd = process.cwd();
    this.mode = toEnv(config.mode) || toEnv(NODE_ENV) || "development";
    this.dataDir = path.resolve(cwd, config.dataDir || "./data");
    this.viewsDir = path.resolve(cwd, config.viewsDir || "./views");
    this.outDir = path.resolve(cwd, config.outDir || "./dist");
    this.plugins = config.plugins || [];
  }
}

function toEnv(e?: string) {
  if (e === "production" || e === "development" || e === "test" ) {
    return e;
  }
  return;
}