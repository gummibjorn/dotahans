import {Analysis, AnalysisMaker} from "./analysis";
import {MessageId, MatchId, TelegramMessage, UserId, AnalysisTypeEnum} from "./hans.types";
import {Subject} from "rxjs/Subject";
import {potato, ratingOptions} from "./telegramRating";


const makeInlineKeyboardButton = (text, callback_data) => ({text, callback_data});
const ratingReplyMarkup = { inline_keyboard: [ ratingOptions.map(makeInlineKeyboardButton) ] };

interface MessageInfo {
  messageId : MessageId;
  messageType: "start" | "end";
  chatId : number;
}

export class MessageSender {

  private matchInfo: Map<MatchId, Analysis> = new Map();
  private messageInfo: Map<MatchId, MessageInfo> = new Map();
  chatToMatch: Map<MessageId, MatchId> = new Map();

  constructor(analysisMaker: AnalysisMaker, messageMatchMap: any, private bot: any) {
    //this.sendMatchComplete(new Analysis(1))

    analysisMaker.complete.subscribe((message: Analysis) => {
      this.sendMatchComplete(message)
      //format analysis (object => telegram markdown)
      //get match from map
      /*
      if (match in map) {
        //update message
      } else {
        //add match to map
        //send message
      }
      */
    });
  }

  private getMatchInfo(matchId: MatchId){
    let info = this.matchInfo[matchId];
    if(info === undefined){
      info = new Map();
      this.matchInfo[matchId] = info;
    }
    return info;
  }

  public format(analysis: Analysis): string{
    return analysis.formatPart(AnalysisTypeEnum.RATING, (rating: Map<any, string>) => {
      let msg = "=>";
      //for some reaseon, map.entries() refuses to work
      for(const userid of Object.keys(rating)){
        const r = rating[userid];
        msg += `${r}`;
      }
      return msg;
    })
  }

  private async sendMatchComplete(analysis: Analysis) {
    const matchId = analysis.getMatchId();
    const messageInfo = this.messageInfo[matchId];
    if(messageInfo === undefined || messageInfo.messageType === "start"){
      //todo: in case of existing start message, remove that
      //send new message
      const message = await this.bot.sendMessage(process.env.TELEGRAM_CHAT, "-> " + this.format(analysis), {
        reply_markup: ratingReplyMarkup
      });
      this.chatToMatch[message.message_id] = matchId;
      this.messageInfo[matchId] = {messageId: message.message_id, messageType: "end", chatId: message.chat.id};
    } else {
      //update existing message
      this.bot.editMessageText(this.format(analysis), {
        message_id: messageInfo.messageId,
        chat_id: messageInfo.chatId,
        reply_markup: ratingReplyMarkup
      })
    }


  }
}
