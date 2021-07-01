import { EntityMeta, Entities } from "./Entity";
declare type ProxiedEntity = {
    meta: EntityMeta;
    data: any;
};
declare type ForEachCallback = (proxiedEntity: ProxiedEntity) => void;
declare type MapCallback<T> = (proxiedEntity: ProxiedEntity) => T;
declare type FilterCallback = (proxiedEntity: ProxiedEntity) => boolean;
export declare class EntityList {
    private readonly entities;
    private readonly entityMap;
    private readonly prefix;
    constructor(entities: Entities, prefix?: string);
    private getEntityByRef;
    private proxy;
    private toProxiedEntity;
    forEach(cb: ForEachCallback): void;
    map<T>(cb: MapCallback<T>): T[];
    filter(cb: FilterCallback): ProxiedEntity[];
}
export {};
//# sourceMappingURL=EntityList.d.ts.map