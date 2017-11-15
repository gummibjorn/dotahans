import {Analysis, AnalysisMaker} from "./analysis";

class TelegramMessage {

}

export class MessageSender {

  private message: Map<string, TelegramMessage>;

  constructor(analysisMaker: AnalysisMaker, messageMatchMap: any, telegramAPI: any) {
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
}