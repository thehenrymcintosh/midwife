import { InputConfig } from "./entities/Config";
export declare class Builder {
    private readonly config;
    constructor(config: InputConfig);
    build(): Promise<null>;
    private runLoadPlugins;
    private runModifyPlugins;
    private runExportPlugins;
    private runLoadPlugin;
    private getDataFiles;
}
//# sourceMappingURL=Builder.d.ts.map