import {AnalysisTypeEnum, Analyzer} from "../hans.types";
import {DotaApiMatchResult, Player} from "../dota-api";
import {HansConfig} from "../hans.config";

export class DetermineWhoWon implements Analyzer {
  analysisType = AnalysisTypeEnum.WHOWON;

  analyze(matchInfo: DotaApiMatchResult): any {
    return {
      won: this.didWeWin(matchInfo),
      duration: matchInfo.duration,
      mode: matchInfo.game_mode
    };
  }

  private didWeWin(matchInfo): boolean {
    return this.areWeRadiant(matchInfo.players) && matchInfo.radiant_win;
  }

  private areWeRadiant(players: Player[]): boolean {
    let areWeRadiant = false;
    HansConfig.players.forEach(player => {
      const firstKnownPlayer = players.find(p => p.account_id === player.account_id);
      if (firstKnownPlayer) {
        areWeRadiant = firstKnownPlayer.player_slot < 5;
        return;
      }
    });
    return areWeRadiant;
  }
}
