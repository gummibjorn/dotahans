import { Request, Response } from "express";
import { Subject } from "rxjs/Subject";
import { DotaAPIMatchMessage, Match, GameStateIntegrationMessage } from "./hans.types";

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  res.render("home", {
    title: "Home"
  });
};


export class MatchManager {

  private matches: Map<number, Match>;
  endOfMatch: Subject<Match> = new Subject();
  startOfMatch: Subject<Match>;

  onGameFinished(message: DotaAPIMatchMessage) {
    const game: Match = new Match();
    if (!this.matchExists(game)) {
      //add game to map
    }
    //trigger end of game event
    this.endOfMatch.next(game);
  }

  onGameUpdate(message: GameStateIntegrationMessage) {
    const game: Match = new Match();
    if (!this.matchExists(game)) {
      //add game to map
      //trigger new game event
    }
    //store message in game
  }

  private matchExists(game: Match): boolean {
    return false;
  }
}