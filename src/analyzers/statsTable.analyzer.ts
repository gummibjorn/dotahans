import {AnalysisFormat, AnalysisType, AsyncAnalyzer} from "../hans.types";
import {DotaApiMatchResult} from "../dota-api";
import {Account} from "../hans.types";
import {CanvasTableDrawer} from "./canvasStatsTable";
import * as moment from "moment";
import "moment-duration-format";
import {Analysis} from "../analysis";
import WhoWon = AnalysisFormat.WhoWon;

export class StatsTable implements AsyncAnalyzer {
  analysisType = AnalysisType.STATSTABLE;

  constructor(private knownPlayers: Account[]) {
  }

  analyze(matchInfo: DotaApiMatchResult, analysis: Analysis): Promise<any> {
    if (!this.didDependantAnalyzersRun(analysis) || this.didIRun(analysis)) {
      return undefined;
    }


    const duration = moment.duration(matchInfo.duration, "seconds").format("hh:mm:ss");
    const didWeWin = (analysis.get(AnalysisType.WHOWON) as WhoWon).won;
    const playerSummaryTuples = analysis.get(AnalysisType.NAMERESOLVER).playerSummaries;

    const winMessage = didWeWin ? "Mir händ gwunne" : "Ufs Dach becho";

    const drawer = new CanvasTableDrawer(winMessage, duration, matchInfo.radiant_score, matchInfo.dire_score, matchInfo.radiant_win, this.knownPlayers);

    matchInfo.players.forEach(p => {
      drawer.addPlayer(
        {
          hero: p.hero_id,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          level: p.level,
          name: this.getName(p.account_id, playerSummaryTuples.find(tuple => tuple.account_id == p.account_id)),
        }
      );
    });

    return drawer.draw().then(canvas => {
      return {buffer: canvas.toBuffer()};
    });
  }

  private didDependantAnalyzersRun(analysis: Analysis): boolean {
    return analysis.get(AnalysisType.WHOWON) && analysis.get(AnalysisType.NAMERESOLVER);
  }

  private didIRun(analysis: Analysis): boolean {
    return analysis.get(this.analysisType);
  }

  private getName(account_id: number, playerSummaryTuple): string {
    //shitty to test with hard wired config files
    const knownPlayer = this.knownPlayers.find(p => p.account_id === account_id);
    if (knownPlayer) {
      return knownPlayer.name;
    } else {
      if (playerSummaryTuple) {
        return playerSummaryTuple.playerSummary.personaname;
      } else {
        return "-";
      }
    }
  }
}


