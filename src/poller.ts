import {MatchId} from "./hans.types";
import {MatchManager} from "./matchManager";
import {DotaApi} from "./dota.api";
import {Account} from "./hans.types";
import {Redis} from "ioredis";

const redisKey = "poller_matches"
export class Poller {

  constructor(private matchManager: MatchManager, private dotaApi: DotaApi, private accounts: Account[], private redis: Redis) {
  }

  async hasMatch (id):Promise<0|1>{
    return this.redis.sismember(redisKey, id);
  }

  async poll() {
    this.accounts.forEach(async account => {
      this.dotaApi.getLastMatch(account.account_id).subscribe(
        async match => {
          if (! await this.hasMatch(match.match_id)) {
            this.redis.sadd(redisKey, match.match_id);
            this.dotaApi.getMatchDetails(match.match_id).subscribe(
              matchDetails => {
                this.matchManager.onMatchFinished(matchDetails);
              },
              error => {
                // be smarter
                console.error("Error occurred while accessing dota API");
              }
            );
          } else {
            console.debug(`Skipping match ${match.match_id}, already known.`)
          }
        },
        error => {
          // be smarter
          console.error("Error occurred while accessing dota API");
        }
      );
    });
  }
}
