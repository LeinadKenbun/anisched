"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = exports.getPermissionString = exports.Type = void 0;
var Type;
(function (Type) {
    Type[Type["ANY"] = 0] = "ANY";
    Type[Type["CHANNEL_MANAGER"] = 1] = "CHANNEL_MANAGER";
    Type[Type["SERVER_OWNER"] = 2] = "SERVER_OWNER";
})(Type = exports.Type || (exports.Type = {}));
;
function getPermissionString(permission) {
    switch (permission) {
        case Type.SERVER_OWNER: return "May only be used by the server owner.";
        case Type.CHANNEL_MANAGER: return "Requires the Channel Manager permission.";
        default: return null;
    }
}
exports.getPermissionString = getPermissionString;
function checkPermission(permission, message) {
    switch (permission) {
        case Type.SERVER_OWNER: message.author.id === message.channel.guild.ownerID;
        case Type.CHANNEL_MANAGER: message.channel.permissionsOf(message.author.id).has("MANAGE_CHANNELS");
        default: return true;
    }
}
exports.checkPermission = checkPermission;
//# sourceMappingURL=Permission.js.map