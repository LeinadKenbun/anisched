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
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../Util");
const Command_1 = require("./Command");
const fs_1 = require("fs");
const path_1 = require("path");
const watchingQuery = fs_1.readFileSync(path_1.join(__dirname, "../query/Watching.graphql"), "utf8");
exports.default = new Command_1.default({
    name: "watching",
    description: "Lists all the anime that are being watched by this channel.",
    handler: (resolve, message, args, serverStore, channelStore, client) => __awaiter(void 0, void 0, void 0, function* () {
        if (channelStore.shows.length === 0) {
            message.addReaction("👎");
            return resolve();
        }
        function handleWatchingPage(page) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield Util_1.query(watchingQuery, { watched: channelStore.shows, page });
                let description = "";
                response.data.Page.media.forEach((m) => {
                    if (m.status === "FINISHED" || m.status === "CANCELLED") {
                        channelStore.shows = channelStore.shows.filter(s => s !== m.id);
                        return;
                    }
                    const nextLine = `\n• [${m.title.romaji}](${m.siteUrl})${m.nextAiringEpisode ? `(~${Util_1.formatTime(m.nextAiringEpisode.timeUntilAiring)})` : ''}`;
                    if (1000 - description.length < nextLine.length) {
                        sendWatchingList(description, message, message.channel);
                        description = "";
                    }
                    description += nextLine;
                });
                if (description.length !== 0)
                    sendWatchingList(description, message, message.channel);
                if (response.data.Page.pageInfo.hasNextPage) {
                    handleWatchingPage(response.data.Page.pageInfo.currentPage + 1);
                    return;
                }
                if (description.length === 0)
                    Util_1.reply(message, "No currently airing shows are being announced.");
            });
        }
        yield handleWatchingPage(1);
        resolve();
    })
});
function sendWatchingList(description, message, channel) {
    const embed = {
        title: "Current announcements",
        color: 5367572,
        author: {
            name: "WeebElves",
            url: "https://anilist.co",
            icon_url: "https://images-ext-1.discordapp.net/external/3aGW13JOL6jxMdIj0iC4Y09YgC24dqAcj4Ex5wNFNhw/https/media.discordapp.net/attachments/595551516442624019/848863278343782431/elves.png"
        },
        description
    };
    channel.createMessage({
        embed,
        messageReferenceID: message.id
    });
}
//# sourceMappingURL=CommandWatching.js.map