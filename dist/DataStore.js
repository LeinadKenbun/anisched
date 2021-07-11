"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelStorage = exports.ServerStorage = void 0;
const class_transformer_1 = require("class-transformer");
require("reflect-metadata");
const fs_1 = require("fs");
const Permission_1 = require("./Permission");
class Storage {
    constructor() {
        this.servers = [];
    }
    getServerStorage(guild) {
        let storage = this.servers.find(storage => storage.guildId === guild.id);
        if (!storage)
            this.servers.push(storage = new ServerStorage(guild));
        return storage;
    }
    getChannelStorage(channel) {
        return this.getServerStorage(channel.guild).getChannelStorage(channel);
    }
    save() {
        return new Promise(resolve => {
            fs_1.writeFile("./data.json", JSON.stringify(class_transformer_1.classToPlain(this)), err => {
                if (err)
                    console.log("Error saving data", err);
                resolve();
            });
        });
    }
}
__decorate([
    class_transformer_1.Type(() => ServerStorage),
    __metadata("design:type", Array)
], Storage.prototype, "servers", void 0);
exports.default = Storage;
class ServerStorage {
    constructor(guild) {
        this.channels = [];
        this.permission = Permission_1.Type.SERVER_OWNER;
        this.prefix = "?as";
        this.guildId = guild ? guild.id : undefined;
    }
    getChannelStorage(channel) {
        let storage = this.channels.find(storage => storage.channelId === channel.id);
        if (!storage)
            this.channels.push(storage = new ChannelStorage(channel));
        return storage;
    }
}
__decorate([
    class_transformer_1.Type(() => ChannelStorage),
    __metadata("design:type", Array)
], ServerStorage.prototype, "channels", void 0);
exports.ServerStorage = ServerStorage;
class ChannelStorage {
    constructor(channel) {
        this.shows = [];
        this.channelId = channel ? channel.id : undefined;
    }
}
exports.ChannelStorage = ChannelStorage;
//# sourceMappingURL=DataStore.js.map