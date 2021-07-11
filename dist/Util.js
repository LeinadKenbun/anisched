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
exports.reply = exports.formatTime = exports.parseTime = exports.createAnnouncementEmbed = exports.getFromNextDays = exports.getMediaId = exports.query = void 0;
const node_fetch_1 = require("node-fetch");
function query(query, variables) {
    return __awaiter(this, void 0, void 0, function* () {
        return node_fetch_1.default("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query,
                variables
            })
        }).then(res => res.json());
    });
}
exports.query = query;
const alIdRegex = /anilist\.co\/anime\/(.\d*)/;
const malIdRegex = /myanimelist\.net\/anime\/(.\d*)/;
function getMediaId(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = parseInt(input);
        if (output)
            return output;
        let match = alIdRegex.exec(input);
        if (match)
            return parseInt(match[1]);
        match = malIdRegex.exec(input);
        if (!match)
            return null;
        return yield query("query($malId: Int){Media(idMal:$malId){id}}", { malId: match[1] }).then(res => {
            if (res.errors) {
                console.log(JSON.stringify(res.errors));
                return;
            }
            return res.data.Media.id;
        });
    });
}
exports.getMediaId = getMediaId;
function getFromNextDays(days = 1) {
    return new Date(new Date().getTime() + (24 * 60 * 60 * 1000 * days));
}
exports.getFromNextDays = getFromNextDays;
const streamingSites = [
    "Official Site",
    "Amazon",
    "AnimeLab",
    "Crunchyroll",
    "Funimation",
    "Hidive",
    "Hulu",
    "Netflix",
    "Viz",
    "VRV",
    "Bilibili",
    "Youtube",
];




function createAnnouncementEmbed(entry, date, upNext)

      
 {
    
    let description = `Episode ${entry.episode} of [**${entry.media.title.romaji}**](${entry.media.siteUrl})${upNext ? "" : " is now Airing!!! <a:yay:833360479648743444>\n<@&833228900799873044> "}`;
    if (entry.media.externalLinks && entry.media.externalLinks.length > 0) {

        const streams = [];
        entry.media.externalLinks.forEach((site) => {
            if (streamingSites.find(s => s.toLowerCase() === site.site.toLowerCase()))
                streams.push(`[${site.site}](${site.url})`);
        });
        description += "\n\n" + (streams.length > 0 ? "Watch: " + streams.join(" • ") + "\n\n*It may take some time to appear on the above service(s)*" : "**No licensed streaming links available**");
    }
    
 
    const format = !entry.media.format ? "" : `Format: ${entry.media.format.includes("_") ? displayify(entry.media.format) : entry.media.format}`;  
    const episodes = !entry.media.episodes ? "" : `${entry.media.format.includes("_") ? displayify(entry.media.episodes) : entry.media.episodes} Episode(s)`;  
    const duration = !entry.media.duration ? "" : `Duration: ${formatTime(entry.media.duration * 60)}`;
    const studio = !entry.media.studios || entry.media.studios.edges.length === 0 ? "" : `Studio: ${entry.media.studios.edges[0].node.name}`;
    return {
    
        color: entry.media.coverImage.color ? parseInt(entry.media.coverImage.color.substr(1), 16) : 43775,
        image: {
            url: entry.media.bannerImage
        },
        author: {
            name: "WeebElves",
            url: "https://anilist.co",
            icon_url: "https://media.discordapp.net/attachments/595551516442624019/848915878812450856/elves.png"
        },
        description,
        
        timestamp: date,
        footer: {
            text: [format, episodes, duration, studio,].filter(e => e.length > 0).join(" • ")
        
        
        
        }
        
        
      
    };
    
}

exports.createAnnouncementEmbed = createAnnouncementEmbed;
function displayify(enumVal) {
    const words = enumVal.split("_");
    for (let i = 0; i < words.length; i++)
        words[i] = words[i].substr(0, 1) + words[i].toLowerCase().substr(1);
    return words.join(" ");
    
}
function parseTime(seconds) {
    let weeks = Math.floor(seconds / (3600 * 24 * 7));
    seconds -= weeks * 3600 * 24 * 7;
    let days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return { weeks, days, hours, minutes, seconds };
}
exports.parseTime = parseTime;
function formatTime(seconds, appendSeconds) {
    const time = parseTime(seconds);
    let ret = "";
    if (time.weeks > 0)
        ret += time.weeks + "w";
    if (time.days > 0)
        ret += (ret.length === 0 ? "" : " ") + time.days + "d";
    if (time.hours > 0)
        ret += (ret.length === 0 ? "" : " ") + time.hours + "h";
    if (time.minutes > 0)
        ret += (ret.length === 0 ? "" : " ") + time.minutes + "m";
    if (appendSeconds && time.seconds > 0)
        ret += (ret.length === 0 ? "" : " ") + time.seconds + "s";
    return ret;
}
exports.formatTime = formatTime;

function reply(message, content) {
    return message.channel.createMessage({
        content,
        messageReferenceID: message.id
    });
}

exports.reply = reply;

//# sourceMappingURL=Util.js.map