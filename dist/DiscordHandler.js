"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupClient = exports.createClient = void 0;
const eris_1 = require("eris");
const AniSchedule_1 = require("./AniSchedule");
const Command_1 = require("./command/Command");
const Permission_1 = require("./Permission");
let client;
function createClient() {
    return client ? client : client = new eris_1.Client(process.env.BOT_TOKEN, {
        autoreconnect: true,
        guildSubscriptions: false,
        disableEvents: {
            CHANNEL_CREATE: true,
            CHANNEL_DELETE: true,
            CHANNEL_UPDATE: true,
            GUILD_BAN_ADD: true,
            GUILD_BAN_REMOVE: true,
            GUILD_CREATE: false,
            GUILD_DELETE: true,
            GUILD_MEMBER_ADD: true,
            GUILD_MEMBER_DELETE: true,
            GUILD_MEMBER_UPDATE: true,
            GUILD_ROLE_CREATE: true,
            GUILD_ROLE_DELETE: true,
            GUILD_ROLE_UPDATE: true,
            GUILD_UPDATE: true,
            MESSAGE_CREATE: false,
            MESSAGE_DELETE: true,
            MESSAGE_DELETE_BULK: true,
            MESSAGE_UPDATE: true,
            PRESENCE_UPDATE: true,
            TYPING_START: true,
            USER_UPDATE: false,
            VOICE_STATE_UPDATE: true,
        },
        allowedMentions: {
            everyone: false,
            roles: false,
            users: false
        }
    });
}
exports.createClient = createClient;
;
function setupClient(client) {
    client.on("error", e => console.log(e));
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
        console.log(`Joining ${client.guilds.size} servers: ${client.guilds.map(g => g.name).join(", ")}`);
    });
    client.on("messageCreate", message => {
        if (message.channel.recipient)
            return;
        if (message.author.bot)
            return;
        const serverStorage = AniSchedule_1.getStorage().getServerStorage(message.channel.guild);
        const messageSplit = message.content.split(" ");
        if (!messageSplit[0].startsWith(serverStorage.prefix))
            return;
        const usedCommand = messageSplit[0].substring(serverStorage.prefix.length);
        const command = Command_1.commands.find(c => c.options.name === usedCommand);
        if (!command)
            return;
        if (command.options.checksPermission && !Permission_1.checkPermission(serverStorage.permission, message))
            message.channel.createMessage(Permission_1.getPermissionString(serverStorage.permission));
        new Promise(resolve => {
            command.options.handler(resolve, message, messageSplit.slice(1), serverStorage, serverStorage.getChannelStorage(message.channel), client);
        }).then(() => AniSchedule_1.getStorage().save());
    });
}
exports.setupClient = setupClient;
//# sourceMappingURL=DiscordHandler.js.map


var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
server.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
