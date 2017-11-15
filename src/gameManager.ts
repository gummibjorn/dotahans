import {Request, Response} from "express";
import {Subject} from "rxjs/Subject";

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  res.render("home", {
    title: "Home"
  });
};

export class Game {
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
  endOfGame: Subject<Game> = new Subject();
  startOfGame: Subject<Game>;

  onGameFinished(message: DotaAPIMatchMessage) {
    const game: Game = new Game();
    if (!this.gameExists(game)) {
      //add game to map
    }
    //trigger end of game event
    this.endOfGame.next(game);
  }

  onGameUpdate(message: GameStateIntegrationMessage) {
    const game: Game = new Game();
    if (!this.gameExists(game)) {
      //add game to map
      //trigger new game event
    }
    //store message in game
  }

  private gameExists(game: Game): boolean {
    return false;
  }
}