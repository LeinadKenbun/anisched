"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
exports.commands = [];
class Command {
    constructor(options) {
        this.options = options;
        exports.commands.push(this);
    }
}
exports.default = Command;
require("./CommandHelp");
require("./CommandWatch");
require("./CommandUnwatch");
require("./CommandWatching");
require("./CommandNext");
require("./CommandPermission");
require("./CommandPrefix");
require("./CommandNextDay");
//# sourceMappingURL=Command.js.map