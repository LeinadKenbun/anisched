import { query, formatTime, reply } from "../Util";
import Command from "./Command";
import { readFileSync } from "fs";
import { join } from "path";
import { Message, TextableChannel } from "eris";

const watchingQuery = readFileSync(join(__dirname, "../query/Watching.graphql"), "utf8");

export default new Command({
  name: "watching",
  description: "Lists all the anime that are being watched by this channel.",
  handler: async (resolve, message, args, serverStore, channelStore, client) => {
    if (channelStore.shows.length === 0) {
      message.addReaction("👎");
      return resolve();
    }

    async function handleWatchingPage(page: number) {
      const response = await query(watchingQuery, { watched: channelStore.shows, page });
      let description = "";
      response.data.Page.media.forEach((m: any) => {
        if (m.status === "FINISHED" || m.status === "CANCELLED") {
          channelStore.shows = channelStore.shows.filter(s => s !== m.id);
          return;
        }
        const nextLine = `\n• [${m.title.romaji}](${m.siteUrl})${m.nextAiringEpisode ? `(~${formatTime(m.nextAiringEpisode.timeUntilAiring)})` : ''}`;
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
        reply(message, "No currently airing shows are being announced.");
    }

    await handleWatchingPage(1);
    resolve();
  }
});

function sendWatchingList(description: string, message: Message, channel: TextableChannel) {
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