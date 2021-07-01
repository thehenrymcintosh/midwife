"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var path_1 = __importDefault(require("path"));
var NODE_ENV = process.env['NODE_ENV'];
var Config = (function () {
    function Config(config) {
        var cwd = process.cwd();
        this.mode = toEnv(config.mode) || toEnv(NODE_ENV) || "development";
        this.dataDir = path_1.default.resolve(cwd, config.dataDir || "./data");
        this.viewsDir = path_1.default.resolve(cwd, config.viewsDir || "./views");
        this.outDir = path_1.default.resolve(cwd, config.outDir || "./dist");
        this.plugins = config.plugins || [];
        this.refPrefix = typeof config.refPrefix !== "undefined" ? config.refPrefix : "#";
    }
    return Config;
}());
exports.Config = Config;
function toEnv(e) {
    if (e === "production" || e === "development" || e === "test") {
        return e;
    }
    return;
}
//# sourceMappingURL=Config.js.map