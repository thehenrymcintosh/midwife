import { AllPluginTypes } from "./Plugin";
export interface InputConfig {
    mode?: string;
    dataDir?: string;
    viewsDir?: string;
    outDir?: string;
    refPrefix?: string;
    plugins?: AllPluginTypes[];
}
export declare class Config {
    readonly mode: "development" | "test" | "production";
    readonly dataDir: string;
    readonly viewsDir: string;
    readonly outDir: string;
    readonly refPrefix: string;
    readonly plugins: AllPluginTypes[];
    constructor(config: InputConfig);
}
//# sourceMappingURL=Config.d.ts.map