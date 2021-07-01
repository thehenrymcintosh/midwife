"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityList = void 0;
var EntityList = (function () {
    function EntityList(entities, prefix) {
        this.entities = entities;
        this.prefix = typeof prefix === "string" ? prefix : "";
        this.proxy = this.proxy.bind(this);
        this.toProxiedEntity = this.toProxiedEntity.bind(this);
        this.getEntityByRef = this.getEntityByRef.bind(this);
        this.forEach = this.forEach.bind(this);
        this.map = this.map.bind(this);
        this.filter = this.filter.bind(this);
        var entityMap = {};
        this.entities.forEach(function (e) {
            e.aliases()
                .forEach(function (alias) {
                if (entityMap[alias])
                    throw new Error("Duplicate entity alias: \"" + alias + "\". Aliases must be unique!");
                entityMap[alias] = e.unwrap();
            });
        });
        this.entityMap = entityMap;
    }
    EntityList.prototype.getEntityByRef = function (val) {
        var _a = this, prefix = _a.prefix, entityMap = _a.entityMap;
        if (typeof val !== "string")
            return val;
        if (!val.startsWith(prefix))
            return val;
        var key = val.slice(prefix.length);
        if (entityMap[key])
            return entityMap[key];
        return val;
    };
    EntityList.prototype.proxy = function (data) {
        var _a = this, proxy = _a.proxy, getEntityByRef = _a.getEntityByRef;
        if (typeof data !== "object")
            return data;
        function getValue(val) {
            var returnValue = getEntityByRef(val);
            if (typeof returnValue === "object" && returnValue !== null) {
                return proxy(returnValue);
            }
            else {
                return returnValue;
            }
        }
        var handler = {
            get: function (target, prop) {
                if (prop === Symbol.iterator) {
                    return function () {
                        var _a, _b, e, e_1_1;
                        var e_1, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 5, 6, 7]);
                                    _a = __values(Object.entries(target)), _b = _a.next();
                                    _d.label = 1;
                                case 1:
                                    if (!!_b.done) return [3, 4];
                                    e = _b.value;
                                    return [4, getValue(e[1])];
                                case 2:
                                    _d.sent();
                                    _d.label = 3;
                                case 3:
                                    _b = _a.next();
                                    return [3, 1];
                                case 4: return [3, 7];
                                case 5:
                                    e_1_1 = _d.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3, 7];
                                case 6:
                                    try {
                                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                    return [7];
                                case 7: return [2];
                            }
                        });
                    };
                }
                return getValue(target[prop]);
            },
        };
        return new Proxy(data, handler);
    };
    EntityList.prototype.toProxiedEntity = function (entity) {
        return { meta: entity.meta(), data: this.proxy(entity.unwrap()) };
    };
    EntityList.prototype.forEach = function (cb) {
        var _a = this, toProxiedEntity = _a.toProxiedEntity, entities = _a.entities;
        entities.forEach(function (entity) {
            cb(toProxiedEntity(entity));
        });
    };
    EntityList.prototype.map = function (cb) {
        var _a = this, toProxiedEntity = _a.toProxiedEntity, entities = _a.entities;
        return entities.map(function (entity) { return cb(toProxiedEntity(entity)); });
    };
    EntityList.prototype.filter = function (cb) {
        var _a = this, toProxiedEntity = _a.toProxiedEntity, entities = _a.entities;
        return entities
            .map(function (e) { return toProxiedEntity(e); })
            .filter(cb);
    };
    return EntityList;
}());
exports.EntityList = EntityList;
//# sourceMappingURL=EntityList.js.map