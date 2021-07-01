export interface EntityMeta {
    outpath?: string;
    aliases: string[];
    _self: string;
    [k: string]: any;
}
declare type AcceptibleEntities = string | Record<any, any> | number | string[] | number[] | Record<any, any>[];
export declare type Entities = Entity<any>[];
export declare class Entity<T extends AcceptibleEntities> {
    private _meta;
    private _data;
    constructor(id: string, rawloaded: T);
    addAlias(aliases?: string | string[]): void;
    id(): string;
    unwrap(): T;
    aliases(): string[];
    outpath(): string | undefined;
    meta(): EntityMeta;
}
export {};
//# sourceMappingURL=Entity.d.ts.map