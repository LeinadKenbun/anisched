"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Permission_1 = require("../Permission");
const Command_1 = require("./Command");
exports.default = new Command_1.default({
    name: "prefix",
    description: "Allows the server owner to set the command prefix for this server.",
    checksPermission: true,
    handler(resolve, message, args, serverStore, channelStore, client) {
        if (Permission_1.checkPermission(Permission_1.Type.SERVER_OWNER, message)) {
            serverStore.prefix = args[0];
            message.addReaction("👍");
        }
        else
            message.addReaction("👎");
        resolve();
    }
});
//# sourceMappingURL=CommandPrefix.js.map