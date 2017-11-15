import {Request, Response} from "express";

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  res.render("home", {
    title: "Home"
  });
};

class Game {
  private matchId: number;
}

//received via http from dota clients
class GameStateIntegrationMessage {

}

//inserted from the poller, when it detected a finished game from the dota api
class DotaAPIMatchMessage {

}

export class GameManager {

  private games: Map<number, Game>;
  endOfGame: Subject<Game>;
  startOfGame: Subject<Game>;

  onGameFinished(message: DotaAPIMatchMessage) {
    if (!gameExists(message)) {
      //add game to map
    }
    //trigger end of game event
    this.endOfGameEvent.next(game);
  }

  onGameUpdate(message: GameStateIntegrationMessage) {

    if (!gameExists(message)) {
      //add game to map
      //trigger new game event
    }

    //store message in game
  }


}