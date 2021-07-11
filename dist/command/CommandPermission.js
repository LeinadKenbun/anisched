"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Permission_1 = require("../Permission");
const Command_1 = require("./Command");
exports.default = new Command_1.default({
    name: "permission",
    description: "Allows the server owner to set the permission required for modification-based commands.\n`ANY`, `CHANNEL_MANAGER`, `SERVER_OWNER`",
    checksPermission: true,
    handler(resolve, message, args, serverStore, channelStore, client) {
        if (Permission_1.checkPermission(Permission_1.Type.SERVER_OWNER, message)) {
            let flag = true;
            switch (args[0]) {
                case "ANY": serverStore.permission = Permission_1.Type.ANY;
                case "CHANNEL_MANAGER": serverStore.permission = Permission_1.Type.CHANNEL_MANAGER;
                case "SERVER_OWNER": serverStore.permission = Permission_1.Type.SERVER_OWNER;
                default: flag = false;
            }
            message.addReaction(flag ? "👍" : "👎");
        }
        else
            message.addReaction("👎");
        resolve();
    }
});
//# sourceMappingURL=CommandPermission.js.map