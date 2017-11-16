import {Observable} from "rxjs/Observable";
import {Match} from "./dota-api";
import * as request from "request";
import {DotaAPIMatchMessage} from "./hans.types";

export class DotaApi {

  private API_URL_MATCH_HISTORY = "https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001";
  private API_URL_MATCH_DETAIL = "https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/";

  getLastMatch(playerId: number): Observable<Match> {
    const requestProps = {key: process.env.STEAM_API_KEY, account_id: playerId, matches_requested: 1};
    return Observable.create(observable => {
      request.get({url: this.API_URL_MATCH_HISTORY, qs: requestProps}, (err, response, body) => {
        //TODO: error handling
        const result = JSON.parse(body).result;
        observable.next(result.matches[0]);
        observable.complete();
      });
    });
  }

  getMatchDetails(matchId: number): Observable<DotaAPIMatchMessage> {
    const requestProps = {key: process.env.STEAM_API_KEY, match_id: matchId};
    return Observable.create(observable => {
      request.get({url: this.API_URL_MATCH_DETAIL, qs: requestProps}, (err, response, body) => {
        //TODO: error handling
        const match = JSON.parse(body).result;
        observable.next(match);
        observable.complete();
      });
    });
  }
}

