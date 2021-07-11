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
const Permission_1 = require("../Permission");
exports.default = new Command_1.default({
    name: "watch",
    description: "Adds a new anime to watch for in this channel. You can use the AniList ID, AniList URL, or MyAnimeList URL. Multiple series can be added at the same time.",
    checksPermission: true,
    handler: (resolve, message, args, serverStore, channelStore, client) => __awaiter(void 0, void 0, void 0, function* () {
        if (!Permission_1.checkPermission(serverStore.permission, message)) {
            message.addReaction("👎");
            return resolve();
        }
        const failures = [];
        for (let i = 0; i < args.length; i++) {
            const watchId = yield Util_1.getMediaId(args[i]);
            if (!watchId || channelStore.shows.includes(watchId)) {
                failures.push(args[i]);
                continue;
            }
            channelStore.shows.push(watchId);
        }
        if (failures.length > 0) {
            yield Util_1.reply(message, `There were issues adding ${failures
                .map(f => f.startsWith("https://") ? `<${f}>` : f)
                .reduce((prev, curr, idx) => idx === 0 ? curr : prev + ", " + curr)}`);
        }
        message.addReaction(failures.length === args.length ? "👎" : failures.length > 0 ? "😕" : "👍");
        resolve();
    })
});
//# sourceMappingURL=CommandWatch.js.map