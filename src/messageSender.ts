class MessageSender {

  private message: Map<string, TelegramMessage>;

  constructor(analyse: Analysis, telegramAPI) {
    analyse.complete.subscribe(message => {
        //format analysis (object => telegram markdown)
      //get match from map
        if(/*match in map*/){
          //update message
        } else {
            //add match to map
            //send message
        }

    })
  }
}