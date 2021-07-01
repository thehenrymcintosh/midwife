"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginGuards = void 0;
exports.PluginGuards = {
    isLoader: function (plugin) {
        return typeof plugin.accepts === "function" && typeof plugin.load === "function";
    },
    isModifier: function (plugin) { return typeof plugin.modify === "function"; },
    isRender: function (plugin) { return typeof plugin.render === "function"; },
};
//# sourceMappingURL=Plugin.js.map