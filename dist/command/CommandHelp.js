"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Permission_1 = require("../Permission");
const Util_1 = require("../Util");
const Command_1 = require("./Command");
exports.default = new Command_1.default({
    name: "help",
    description: "Prints out all available commands with a short description.",
    handler: (resolve, message, args, serverStore, channelStore, client) => {
        const embed = {
            title: "AniSchedule Commands",
            author: {
                name: "AniSchedule",
                url: "https://anilist.co",
                icon_url: client.user.avatarURL
            },
            color: 4044018,
            description: `[GitHub](https://github.com/TehNut/AniSchedule) • [Author](https://anilist.co/user/42069/)\nFor information on a specific command, use \`${serverStore.prefix}help <command>\`. Do not use the prefix for getting specific command help.`,
            fields: []
        };
        if (args.length > 0) {
            const searched = Command_1.commands.find(c => c.options.name.toLowerCase() === args[0].toLowerCase());
            if (!searched) {
                Util_1.reply(message, `Unknown command name "${args[0]}"`);
                return resolve();
            }
            embed.title = `\`${searched.options.name}\` Information`;
            let description = searched.options.description;
            if (searched.options.checksPermission)
                description += `\n${Permission_1.getPermissionString(serverStore.permission)}`;
            embed.description = description;
        }
        else {
            Command_1.commands.filter(c => c.options.name !== "help").forEach(command => {
                embed.description += `\n• \`${serverStore.prefix}${command.options.name}\``;
            });
        }
        message.channel.createMessage({
            embed,
            messageReferenceID: message.id
        });
        resolve();
    }
});
//# sourceMappingURL=CommandHelp.js.map