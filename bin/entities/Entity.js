"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
var Entity = (function () {
    function Entity(id, rawloaded) {
        if (typeof rawloaded === "undefined")
            throw new Error("Record cannot have undefined contents");
        if (typeof rawloaded === "function")
            throw new Error("Record cannot have a funciton as contents");
        if (rawloaded === null)
            throw new Error("Record cannot have null contents");
        this._meta = { aliases: [id], _self: removeExtension(id) };
        this._data = rawloaded;
        var _meta = rawloaded._meta;
        if (typeof _meta !== "undefined") {
            var aliases = _meta.aliases, alias = _meta.alias, outpath = _meta.outpath, rest = __rest(_meta, ["aliases", "alias", "outpath"]);
            Object.assign(this._meta, rest);
            if (typeof outpath === "string")
                this._meta.outpath = outpath;
            this.addAlias(aliases);
            this.addAlias(alias);
        }
        this._meta = replaceSelf(this._meta._self, this._meta);
        this._data = replaceSelf(this._meta._self, this._data);
    }
    Entity.prototype.addAlias = function (aliases) {
        if (Array.isArray(aliases)) {
            this._meta.aliases = this._meta.aliases.concat(aliases);
        }
        else if (typeof aliases === "string") {
            this._meta.aliases.push(aliases);
        }
    };
    Entity.prototype.id = function () {
        return this.aliases()[0];
    };
    Entity.prototype.unwrap = function () {
        return this._data;
    };
    Entity.prototype.aliases = function () {
        return this._meta.aliases;
    };
    Entity.prototype.outpath = function () {
        return this._meta.outpath;
    };
    Entity.prototype.meta = function () {
        return this._meta;
    };
    return Entity;
}());
exports.Entity = Entity;
function replaceSelf(self, object) {
    return recursiveVisit(object, function (t) { return t.replace(/__SELF/, self); });
}
function recursiveVisit(o, cb) {
    if (Array.isArray(o)) {
        return o.map(function (val) { return recursiveVisit(val, cb); });
    }
    else if (typeof o === "object") {
        var newObject_1 = {};
        Object.entries(o).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], val = _b[1];
            return newObject_1[key] = recursiveVisit(val, cb);
        });
        return newObject_1;
    }
    else if (typeof o === "string") {
        return cb(o);
    }
    else {
        return o;
    }
}
function removeExtension(path) {
    var parts = path.split("/");
    var last = parts.pop();
    if (last) {
        var sliceidx = last.lastIndexOf(".");
        if (sliceidx > 0) {
            parts.push(last.slice(0, sliceidx));
        }
    }
    return parts.join("/");
}
//# sourceMappingURL=Entity.js.map