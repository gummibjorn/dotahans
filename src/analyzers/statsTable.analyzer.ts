import {AnalysisTypeEnum, Analyzer} from "../hans.types";
import {DotaApiMatchResult} from "../dota-api";
import {HansConfig} from "../hans.config";
import * as fs from "fs";
import * as text2png from "text2png";
import * as moment from "moment";

export class StatsTable implements Analyzer {
  analysisType = AnalysisTypeEnum.STATSTABLE;

  analyze(matchInfo: DotaApiMatchResult): any {
    const duration = moment.duration(matchInfo.duration, "seconds").format("hh:mm:ss");
    const header = `Radiant ${matchInfo.radiant_score}\t\t\t${duration}\t\t\t${matchInfo.dire_score} Dire\n`;
    let body = "";
    for (let i = 0; i < 5; i++) {
      const radiantPlayer = matchInfo.players[i];
      const direPlayer = matchInfo.players[i + 5];

      body += `${this.getName(radiantPlayer.account_id)}   ${radiantPlayer.kills}/${radiantPlayer.deaths}`;
      body += "     ------    ";
      body += `${this.getName(direPlayer.account_id)}   ${direPlayer.kills}/${direPlayer.deaths}`;
      body += "\n";
    }
    const statsTable = header + body;
    fs.writeFileSync("statsTable.png", text2png(statsTable, {
      font: "30px Futura",
      textColor: "green",
      bgColor: "black",
      padding: 10
    }));
    return {statsTableULR: "statsTable.png"};
  }

  private getName(account_id: number): string {
    const knownPlayer = HansConfig.players.find(p => p.account_id === account_id);
    if (knownPlayer) {
      return knownPlayer.name;
    } else {
      //TODO: resolve steam account name
      return "Unknown player";
    }
  }
}


