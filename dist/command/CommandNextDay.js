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
    name: "nextday",
    description: "List the upcoming episodes for the next 24 hours. You can provide a number of days (periods of 24 hours) to check. So `2` would be between 24 hours from now and 48 hours from now.",
    checksPermission: true,
    handler: (resolve, message, args, serverStore, channelStore, client) => __awaiter(void 0, void 0, void 0, function* () {
        const skip = Math.max(parseInt(args[0]) || 1, 1);
        const dateGreater = Math.round(Util_1.getFromNextDays(skip - 1).getTime() / 1000);
        const dateLesser = Math.round(Util_1.getFromNextDays(skip).getTime() / 1000);
        const watched = new Set();
        serverStore.channels.forEach(channel => channel.shows.forEach(s => watched.add(s)));
        const allWatching = Array.from(watched.values());
        function handlePage(page) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield Util_1.query(scheduleQuery, { page, watched: allWatching, dateStart: dateGreater, nextDay: dateLesser });
                if (response.errors) {
                    console.log(response.errors);
                    message.addReaction("👎");
                    return;
                }
                response.data.Page.airingSchedules.forEach((e) => {
                    const embed = Util_1.createAnnouncementEmbed(e, new Date(e.airingAt * 1000), true);
                    message.channel.createMessage({
                        embed,
                        messageReferenceID: message.id
                    });
                });
                if (response.data.Page.pageInfo.hasNextPage)
                    yield handlePage(page + 1);
            });
        }
        handlePage(1);
    })
});
//# sourceMappingURL=CommandNextDay.js.map