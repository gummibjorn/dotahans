import * as emoji from "node-emoji"
import {AnalysisMaker} from "./analysis";
import {MessageSender} from "./messageSender";
import {AnalysisTypeEnum, MatchId, MessageId, UserId} from "./hans.types";

export const potato = "\uD83E\uDD54";
export const ratingOptions = [
  potato,
  ...["muscle", "boot", "dark_sunglasses"].map(emoji.get)
]

export class TelegramRating {

  private chatToMatch: Map<MessageId, MatchId> = new Map();
  private matchRatings: Map<MatchId, Map<UserId, string>> = new Map();

  constructor(analysisMaker : AnalysisMaker, messageSender : MessageSender, bot){
    messageSender.chatToMatchMapping.subscribe(next => this.chatToMatch = next);

    bot.on('callback_query', msg => {
      console.log(JSON.stringify(msg, null, 2));
      const messageId = msg.message.message_id;
      const matchId = this.chatToMatch[messageId];
      const userId = msg.from.id;
      let matchRating = this.matchRatings[matchId];
      if(matchRating === undefined){
        matchRating = new Map();
        this.matchRatings[matchId] = new Map();
      }
      matchRating[userId] = ratingOptions[msg.data]
      analysisMaker.externalAnalysis(matchId, AnalysisTypeEnum.RATING, matchRating)

    })
  }

}

