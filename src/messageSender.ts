import {Analysis, AnalysisMaker} from "./analysis";
import {AnalysisFormat, AnalysisTypeEnum, MatchId, MessageId} from "./hans.types";
import {ratingOptions} from "./telegramRating";
import * as TelegramBot from "node-telegram-bot-api";
import {Message} from "node-telegram-bot-api";
import Rating = AnalysisFormat.Rating;
import WhoWon = AnalysisFormat.WhoWon;
import {statsPages} from "./analyzers/determinewhowon.analyzer";
import {duration} from "moment";
import {Stream} from "stream";

import "moment-duration-format";


const makeInlineKeyboardButton = (text, callback_data) => ({text, callback_data});
const ratingReplyMarkup = {inline_keyboard: [ratingOptions.map(makeInlineKeyboardButton)]};

interface MessageInfo {
  messageId: MessageId;
  messageType: "start" | "end";
  chatId: number;
  statsTableSent: boolean;
}

export class MessageSender {

  private messageInfo: Map<MatchId, MessageInfo> = new Map();
  chatToMatch: Map<MessageId, MatchId> = new Map();

  constructor(analysisMaker: AnalysisMaker, messageMatchMap: any, private bot: TelegramBot) {
    //this.sendMatchComplete(new Analysis(1))

    analysisMaker.complete.subscribe((analysis: Analysis) => {
      //todo: figure out if it's a match complete or match in progress message
      this.sendMatchComplete(analysis.getMatchId(), this.format(analysis)).then(
        messageInfo => {
          if (!messageInfo.statsTableSent) {
            const streamPromise = analysis.get(AnalysisTypeEnum.STATSTABLE).bufferPromise;
            if (streamPromise) {
              this.sendStatsTable(streamPromise);
            }
          }
        }
      );
    });
  }

  public format(analysis: Analysis): string {
    return [
      whoWon,
      rating
    ].map((f: Formatter) => analysis.formatPart(f.type, f.format))
      .join("\n\n");
  }

  private async sendStatsTable(streamPromise: Promise<Buffer>) {
    streamPromise.then(buffer => {
      this.bot.sendPhoto(process.env.CHAT_ID, buffer);
    });
  }

  private async sendMatchComplete(matchId: MatchId, text: string): Promise<MessageInfo> {
    const messageInfo: MessageInfo = this.messageInfo[matchId];
    if (messageInfo === undefined || messageInfo.messageType === "start") {
      if (messageInfo && messageInfo.messageType === "start") {
        //in case of existing start message, remove that
        this.bot.deleteMessage(messageInfo.chatId, messageInfo.messageId + "", {});
      }
      //send new message
      const message = await this.bot.sendMessage(process.env.CHAT_ID, text, {
        reply_markup: ratingReplyMarkup
      }) as Message;
      this.chatToMatch[message.message_id] = matchId;
      this.messageInfo[matchId] = {
        messageId: message.message_id,
        messageType: "end",
        chatId: message.chat.id,
        statsTableSent: false
      };
    } else {
      //update existing message
      this.bot.editMessageText(text, {
        message_id: messageInfo.messageId,
        chat_id: messageInfo.chatId,
        reply_markup: ratingReplyMarkup
      });
    }
    return this.messageInfo[matchId];
  }
}

interface Formatter {
  type: AnalysisTypeEnum,
  format: (data: any) => string
}

function makeFormatter(type: AnalysisTypeEnum, format: (data: any) => string) {
  return ({type, format});
}

export const rating = makeFormatter(AnalysisTypeEnum.RATING, (rating: Rating) => {
  let msg = "";
  //for some reason, Map.entries() refuses to work
  for (const userid of Object.keys(rating)) {
    const r = rating[userid];
    msg += `${r}`;
  }
  return msg;
});

export const whoWon = makeFormatter(AnalysisTypeEnum.WHOWON, (whoWon: WhoWon) => {
  const durationFormat = duration(whoWon.duration, "seconds").format("hh:mm:ss");
  const wonLost = whoWon.won ? "won" : "lost";
  const ranked = whoWon.ranked ? "Ranked" : "";
  const stats = Object.keys(statsPages)
    .map(key => `[${key}](${statsPages[key].replace(":id:", whoWon.matchId)})`)
    .join(" ");
  return `${whoWon.players.join(", ")} ${wonLost} ${ranked} ${whoWon.mode} after ${durationFormat} ${stats}`;
});
