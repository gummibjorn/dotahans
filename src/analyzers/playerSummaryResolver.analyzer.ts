import {AnalysisType, AsyncAnalyzer} from "../hans.types";
import {DotaApiMatchResult} from "../dota-api";
import {Analysis} from "../analysis";
import {DotaApi} from "../dota.api";
import "rxjs/add/operator/toPromise";


export class PlayerSummaryResolver implements AsyncAnalyzer {
  analysisType = AnalysisType.NAMERESOLVER;

  constructor(private dotaApi: DotaApi) {
  }

  analyze(matchInfo: DotaApiMatchResult, analysis: Analysis): Promise<any> {
    if (this.didIRun(analysis)) {
      return undefined;
    }
    return this.dotaApi.getPlayerSummaries(matchInfo.players.map(p => p.account_id)).toPromise().then(
      players => ({
        playerSummaries: players.map(p => {
          return {account_id: p.steamid3, playerSummary: p};
        })
      }));
  }

  private didIRun(analysis: Analysis): boolean {
    return analysis.get(this.analysisType);
  }
}
