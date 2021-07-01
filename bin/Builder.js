"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
var Config_1 = require("./entities/Config");
var Plugin_1 = require("./entities/Plugin");
var glob_1 = __importDefault(require("glob"));
var path_1 = __importDefault(require("path"));
var Entity_1 = require("./entities/Entity");
var EntityList_1 = require("./entities/EntityList");
var Builder = (function () {
    function Builder(config) {
        this.config = new Config_1.Config(config);
        this.runLoadPlugin = this.runLoadPlugin.bind(this);
        this.runLoadPlugins = this.runLoadPlugins.bind(this);
        this.runModifyPlugins = this.runModifyPlugins.bind(this);
        this.runExportPlugins = this.runExportPlugins.bind(this);
    }
    Builder.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var initialEntities, entities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.runLoadPlugins()];
                    case 1:
                        initialEntities = _a.sent();
                        return [4, this.runModifyPlugins(initialEntities)];
                    case 2:
                        entities = _a.sent();
                        return [2, this.runExportPlugins(new EntityList_1.EntityList(entities, this.config.refPrefix))];
                }
            });
        });
    };
    Builder.prototype.runLoadPlugins = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, config, runLoadPlugin, files, loaders;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, config = _a.config, runLoadPlugin = _a.runLoadPlugin;
                        return [4, this.getDataFiles()];
                    case 1:
                        files = _b.sent();
                        loaders = config.plugins
                            .filter(Plugin_1.PluginGuards.isLoader)
                            .map(function (plugin) { return runLoadPlugin(plugin, files); });
                        return [4, Promise.all(loaders)];
                    case 2: return [2, (_b.sent()).reduce(flatten, [])];
                }
            });
        });
    };
    Builder.prototype.runModifyPlugins = function (prevEntities) {
        return __awaiter(this, void 0, void 0, function () {
            var plugins, modPlugins, entities, modPlugins_1, modPlugins_1_1, plugin, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        plugins = this.config.plugins;
                        modPlugins = plugins.filter(Plugin_1.PluginGuards.isModifier);
                        entities = prevEntities;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        modPlugins_1 = __values(modPlugins), modPlugins_1_1 = modPlugins_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!modPlugins_1_1.done) return [3, 5];
                        plugin = modPlugins_1_1.value;
                        return [4, plugin.modify(entities)];
                    case 3:
                        entities = _b.sent();
                        _b.label = 4;
                    case 4:
                        modPlugins_1_1 = modPlugins_1.next();
                        return [3, 2];
                    case 5: return [3, 8];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 8];
                    case 7:
                        try {
                            if (modPlugins_1_1 && !modPlugins_1_1.done && (_a = modPlugins_1.return)) _a.call(modPlugins_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7];
                    case 8: return [2, entities];
                }
            });
        });
    };
    Builder.prototype.runExportPlugins = function (entities) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, plugins, viewsDir, outDir;
            return __generator(this, function (_b) {
                _a = this.config, plugins = _a.plugins, viewsDir = _a.viewsDir, outDir = _a.outDir;
                return [2, Promise.all(plugins
                        .filter(Plugin_1.PluginGuards.isRender)
                        .map(function (plugin) { return plugin.render(entities, viewsDir, outDir); })).then(function () { return null; })];
            });
        });
    };
    Builder.prototype.runLoadPlugin = function (plugin, filePaths) {
        var dataDir = this.config.dataDir;
        return Promise.all(filePaths
            .filter(function (filePath) { return plugin.accepts(filePath); })
            .map(function (filePath) {
            return plugin
                .load(filePath)
                .then(function (pluginResponse) {
                var relpath = path_1.default.relative(dataDir, filePath);
                return new Entity_1.Entity(relpath, pluginResponse);
            });
        }));
    };
    Builder.prototype.getDataFiles = function () {
        var globOptions = {
            cwd: this.config.dataDir,
            absolute: true,
            nodir: true,
            matchBase: true,
        };
        return new Promise(function (resolve, reject) {
            glob_1.default("./**/*", globOptions, function (error, paths) {
                if (error)
                    return reject(error);
                resolve(paths);
            });
        });
    };
    return Builder;
}());
exports.Builder = Builder;
function flatten(acc, current) {
    return acc.concat(current);
}
//# sourceMappingURL=Builder.js.map