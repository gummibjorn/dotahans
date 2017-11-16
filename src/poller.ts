import {MatchId} from "./hans.types";
import {MatchManager} from "./matchManager";
import {DotaApi} from "./dota.api";
import {Config} from "./config";

export class Poller {
  private matches: Set<MatchId> = new Set();
  constructor(private matchManager: MatchManager, private dotaApi: DotaApi) {
  }

  poll() {
    Config.players.forEach(account => {
      this.dotaApi.getLastMatch(account.account_id).subscribe(
        match => {
          if (!this.matches.has(match.match_id)) {
            this.matches.add(match.match_id);
            this.dotaApi.getMatchDetails(match.match_id).subscribe(
              matchDetails => {
                this.matchManager.onGameFinished(matchDetails);
              }
            );
          }
        });
    });
  }
}
