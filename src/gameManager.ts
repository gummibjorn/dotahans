import {Request, Response} from "express";
import {Subject} from "rxjs/Subject";
import {DotaAPIMatchMessage, Game, GameStateIntegrationMessage} from "./hans.types";

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  res.render("home", {
    title: "Home"
  });
};


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