import {MatchId} from "./hans.types";
import {MatchManager} from "./matchManager";
import {DotaApi} from "./dota.api";
import {Account} from "./hans.types";
import {Redis} from "ioredis";
import {Observable} from "rxjs/Observable";
import {DotaApiMatchResult, Match} from "./dota-api";
import 'rxjs/add/operator/first';

const redisKey = "poller_matches"

// might use this to handle backoff: https://www.npmjs.com/package/rx-polling
export function matchStream(dotaApi: DotaApi, accounts: Account[], redis: Redis, pollIntervalSeconds: number) : Observable<DotaApiMatchResult>{
  function poll(observable) {
    return async function () {
      for (let account of accounts) {
        try {
          console.debug(`Looking up matches for ${account.name}`)
          const match = await dotaApi.getLastMatch(account.account_id).first().toPromise();
          if (!(await redis.sismember(redisKey, match.match_id))) {
            observable.next(await dotaApi.getMatchDetails(match.match_id));
            redis.sadd(redisKey, match.match_id);
          } else {
            console.debug(`Already saw match ${match.match_id}`)
          }
        } catch (e) {
          console.warn("Error getting match", e);
        }
      }
    }
  }

  if(pollIntervalSeconds === 0){
    return Observable.create(async observable => {
      await poll(observable)();
      observable.complete();
    });
  } else {
    return Observable.create(observable => {
      setInterval(poll(observable), pollIntervalSeconds * 1000)
    });
  }
}
