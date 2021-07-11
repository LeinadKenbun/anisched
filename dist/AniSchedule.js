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
exports.getStorage = void 0;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const class_transformer_1 = require("class-transformer");
const fs_1 = require("fs");
const DiscordHandler_1 = require("./DiscordHandler");
const DataStore_1 = require("./DataStore");
const Util_1 = require("./Util");
dotenv_1.config();
const scheduleQuery = fs_1.readFileSync(path_1.join(__dirname, "./query/Schedule.graphql"), "utf8");
const client = DiscordHandler_1.createClient();
DiscordHandler_1.setupClient(client);
const storage = getOrCreateStorage();
handleSchedules(Math.round(Util_1.getFromNextDays().getTime() / 1000), 1);
setInterval(() => handleSchedules(Math.round(Util_1.getFromNextDays().getTime() / 1000), 1), 1000 * 60 * 60 * 24);
client.connect();
function getOrCreateStorage() {
    let storage;
    if (fs_1.existsSync("./data.json")) {
        storage = class_transformer_1.plainToClass(DataStore_1.default, JSON.parse(fs_1.readFileSync("./data.json", "utf8")), { enableCircularCheck: true });
    }
    else {
        storage = new DataStore_1.default();
        fs_1.writeFileSync("./data.json", JSON.stringify(class_transformer_1.classToPlain(storage)));
    }
    return storage;
}
function getStorage() {
    return storage;
}
exports.getStorage = getStorage;
let queuedMedia = [];
function handleSchedules(time, page) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield Util_1.query(scheduleQuery, { page, watched: getAllWatched(storage.servers), nextDay: time });
        if (response.errors) {
            console.log(response.errors);
            return;
        }
        response.data.Page.airingSchedules.forEach((e) => {
            if (queuedMedia.includes(e.id))
                return;
            const date = new Date(e.airingAt * 1000);
            console.log(`Scheduling announcement for ${e.media.title.romaji} on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`);
            queuedMedia.push(e.id);
            setTimeout(() => makeAnnouncement(e, date), e.timeUntilAiring * 1000);
        });
        if (response.data.Page.pageInfo.hasNextPage)
            handleSchedules(time, response.data.Page.pageInfo.currentPage + 1);
    });
}
function makeAnnouncement(entry, date, upNext = false) {
    queuedMedia = queuedMedia.filter(q => q !== entry.id);
    const embed = Util_1.createAnnouncementEmbed(entry, date, upNext);
    storage.servers.forEach(server => {
        server.channels.forEach(c => {
            if (!c.shows.includes(entry.media.id))
                return;
            const channel = client.getChannel(c.channelId);
            if (channel) {
                console.log(`Announcing episode ${entry.media.title.romaji} to ${channel.guild.name}@${channel.id}`);
                channel.createMessage({ embed });
                if (entry.media.episodes === entry.episode)
                    c.shows = c.shows.filter(id => id !== entry.media.id);
            }
        });
    });
}
function getAllWatched(storage) {
    const watched = new Set();
    storage.forEach(server => server.channels.forEach(channel => channel.shows.forEach(s => watched.add(s))));
    return Array.from(watched.values());
}
//# sourceMappingURL=AniSchedule.js.map