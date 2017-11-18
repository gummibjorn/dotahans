import {AnalysisMaker} from "./analysis";
import {Analysis, MessageId, MatchId, TelegramMessage, UserId} from "./hans.types";
import * as emoji from "node-emoji"

//const potato = "🥔"; //this looks fine in telegram
const potato = "\uD83E\uDD54";
const ratingOptions = [
  potato,
  ...["muscle", "boot", "dark_sunglasses"].map(emoji.get)
]

const makeInlineKeyboardButton = (text, callback_data) => ({text, callback_data});
interface MatchInfo {
  message_id? : MessageId,
  telegram_rating? : Map<UserId, string>
}

export class MessageSender {

  private matchInfo: Map<MatchId, MatchInfo> = new Map();
  private chatToMatch: Map<MessageId, MatchId> = new Map();

  constructor(analysisMaker: AnalysisMaker, messageMatchMap: any, private bot: any) {
    this.sendMatchComplete(1)
    bot.on('callback_query', msg => {
      console.log(JSON.stringify(msg, null, 2));
      const messageId = msg.message.message_id;
      const matchId = this.chatToMatch[messageId];
      const matchInfo = this.getMatchInfo(matchId);
      const userId = msg.from.id;
      if(matchInfo.telegram_rating === undefined){
        matchInfo.telegram_rating = new Map();
      }
      matchInfo.telegram_rating[userId] = ratingOptions[msg.data]
      console.log(JSON.stringify(matchInfo, null, 2));

    })

    analysisMaker.complete.subscribe((message: Analysis) => {
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
      info = {}
      this.matchInfo[matchId] = info;
    }
    return info;
  }

  private sendMatchComplete(matchId : MatchId) {
    //todo: store message id with match id in map
    const message = this.bot.sendMessage(process.env.TELEGRAM_CHAT, `POTATOES ${potato}`, {
      reply_markup: {
        inline_keyboard: [
          ratingOptions.map(makeInlineKeyboardButton)
        ]
      }
    });
    this.chatToMatch[message.message_id] = matchId;

  }
}
