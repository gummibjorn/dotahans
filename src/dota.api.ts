import {Observable} from "rxjs/Observable";
import {DotaApiMatchResult, Match, PlayerSummary} from "./dota-api";
import * as request from "request";
import BigNumber from "bignumber.js";

export class DotaApi {

  private MATCH_HISTORY = "https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001";
  private MATCH_DETAIL = "https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/";
  private PLAYER_SUMMARY = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/";

  getLastMatch(playerId: number): Observable<Match> {
    const requestProps = {key: process.env.STEAM_API_KEY, account_id: playerId, matches_requested: 1};
    return Observable.create(observable => {
      request.get({url: this.MATCH_HISTORY, qs: requestProps}, (err, response, body) => {
        //TODO: error handling
        const result = JSON.parse(body).result;
        observable.next(result.matches[0]);
        observable.complete();
      });
    });
  }

  getPlayerSummaries(accountIds: number[]): Observable<PlayerSummary[]> {
    const steamid64ident = new BigNumber("76561197960265728");
    const requestProps = {
      key: process.env.STEAM_API_KEY,
      steamids: accountIds.map(a => steamid64ident.add(a)).toString()
    };

    return Observable.create(observable => {
      request.get({url: this.PLAYER_SUMMARY, qs: requestProps}, (err, response, body) => {
        //TODO: error handling
        const result = JSON.parse(body).response;
        observable.next(result.players.map(p => {
          p.steamid3 = new BigNumber(p.steamid).minus(steamid64ident).toNumber();
          return p;
        }));
        observable.complete();
      });
    });
  }

  getMatchDetails(matchId: number): Observable<DotaApiMatchResult> {
    const requestProps = {key: process.env.STEAM_API_KEY, match_id: matchId};
    return Observable.create(observable => {
      request.get({url: this.MATCH_DETAIL, qs: requestProps}, (err, response, body) => {
        //TODO: error handling
        const match = JSON.parse(body).result;
        observable.next(match);
        observable.complete();
      });
    });
  }
}

