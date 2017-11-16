import {Request, Response} from "express";
import {Subject} from "rxjs/Subject";
import {GameStateIntegrationMessage, MatchId} from "./hans.types";
import {DotaApiMatchResult} from "./dota-api";

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
  private matches = new Map<MatchId, DotaApiMatchResult>();
  endOfMatch = new Subject<DotaApiMatchResult>();
  startOfMatch = new Subject<DotaApiMatchResult>();

  onMatchFinished(match: DotaApiMatchResult) {
    if (!this.matches.has(match.match_id)) {
      this.matches.set(match.match_id, match);
    }
    //trigger end of game event
    this.endOfMatch.next(match);
  }

  onGameUpdate(message: GameStateIntegrationMessage) {
    if (!this.matches.has(message.match_id)) {
      //add game to map
      //trigger new game event
    }
    //store message in game
  }
}