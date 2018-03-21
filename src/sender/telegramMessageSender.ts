import {Analysis, AnalysisMaker} from "../analysis";
import {AnalysisType, MatchId, MessageId} from "../hans.types";
import {ratingOptions} from "../telegramRating";
import * as TelegramBot from "node-telegram-bot-api";
import {Message} from "node-telegram-bot-api";
import "moment-duration-format";
import {HansConfig} from "../hans.config";
import {format} from "./messageFormatter";


const makeInlineKeyboardButton = (text, callback_data) => ({text, callback_data});
const ratingReplyMarkup = {inline_keyboard: [ratingOptions.map(makeInlineKeyboardButton)]};

interface MessageInfo {
  messageId: MessageId;
  messageType: "start" | "end";
  chatId: number;
  statsTableSent: boolean;
}

export class TelegramMessageSender{

  private messageInfo: Map<MatchId, MessageInfo> = new Map();
  chatToMatch: Map<MessageId, MatchId> = new Map();
  private sendingInProgress: Promise<MessageInfo>;

  constructor(analysisMaker: AnalysisMaker, private config: HansConfig, private bot: TelegramBot) {
    //this.sendMatchComplete(new Analysis(1))

    analysisMaker.complete.subscribe((analysis: Analysis) => {
      //todo: figure out if it's a match complete or match in progress message
      if (!this.sendingInProgress) {
        this.sendMessage(analysis);
      } else {
        this.sendingInProgress.then(
          () => {
            this.sendMessage(analysis);
          }
        );
      }
    });
  }

  private sendMessage(analysis: Analysis) {
    this.sendingInProgress = this.sendMatchComplete(analysis.getMatchId(), format(analysis));
    this.sendingInProgress.then(
      messageInfo => {
        if (!messageInfo.statsTableSent) {
          const statsTableAnalysis = analysis.get(AnalysisType.STATSTABLE);
          if (statsTableAnalysis) {
            this.sendStatsTable(statsTableAnalysis.buffer);
            messageInfo.statsTableSent = true;
          }
        }
        this.sendingInProgress = undefined;
      }
    );
  }

  private async sendStatsTable(buffer: Buffer) {
    this.bot.sendPhoto(this.config.get("CHAT_ID"), buffer, {
      disable_notification: true
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
      const message = await this.bot.sendMessage(this.config.get("CHAT_ID"), text, {
        reply_markup: ratingReplyMarkup,
        parse_mode: "markdown",
        disable_web_page_preview: true
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
        reply_markup: ratingReplyMarkup,
        parse_mode: "markdown",
        disable_web_page_preview: true
      }).catch(error => {
        if (error.message.includes("400")) {
          console.log("message was updated without any changes");
        } else {
          console.log("unknown error");
        }
      });
    }
    return this.messageInfo[matchId];
  }
}
