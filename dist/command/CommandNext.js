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
const scheduleQuery = fs_1.readFileSync(path_1.join(__dirname, "../query/Schedule.graphql"), "utf8");
exports.default = new Command_1.default({
    name: "next",
    description: "Displays the next episode to air (in the next 7 days) that the current channel is watching.",
    handler: (resolve, message, args, serverStore, channelStore, client) => __awaiter(void 0, void 0, void 0, function* () {
        if (channelStore.shows.length === 0) {
            message.addReaction("👎");
            return resolve();
        }
        const response = yield Util_1.query(scheduleQuery, { watched: channelStore.shows, amount: 1, nextDay: Math.round(Util_1.getFromNextDays(7).getTime() / 1000) });
        if (response.errors) {
            console.log(response.errors);
            message.addReaction("👎");
            return resolve();
        }
        if (response.data.Page.airingSchedules.length === 0) {
            message.addReaction("👎");
            return resolve();
        }
        const anime = response.data.Page.airingSchedules[0];
        const embed = Util_1.createAnnouncementEmbed(anime, new Date(anime.airingAt * 1000), true);
        message.channel.createMessage({
            embed,
            messageReferenceID: message.id
        });
        resolve();
    })
});
//# sourceMappingURL=CommandNext.js.map