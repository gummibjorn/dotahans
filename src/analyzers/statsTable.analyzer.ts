import {AnalysisTypeEnum, Analyzer} from "../hans.types";
import {DotaApiMatchResult} from "../dota-api";
import {HansConfig} from "../hans.config";
import {CanvasTableDrawer} from "./canvasStatsTable";
import * as fs from "fs";
import * as moment from "moment";
import "moment-duration-format";

export class StatsTable implements Analyzer {
  analysisType = AnalysisTypeEnum.STATSTABLE;

  analyze(matchInfo: DotaApiMatchResult): any {
    const duration = moment.duration(matchInfo.duration, "seconds").format("hh:mm:ss");
    //TODO: get info from previous analyzer
    const winner = matchInfo.radiant_win ? "Mir händ gwunne" : "Ufs Dach becho";
    const drawer = new CanvasTableDrawer(winner, duration, matchInfo.radiant_score, matchInfo.dire_score);

    matchInfo.players.forEach(p => {
      drawer.addPlayer(
        {
          hero: p.hero_id,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          level: p.level,
          name: this.getName(p.account_id),
        }
      );
    });

    drawer.draw().then(canvas => {
      const stream = canvas.pngStream();
      const out = fs.createWriteStream("statsTable.png");
      stream.on("data", function (chunk) {
        out.write(chunk);
      });

      stream.on("end", function () {
        console.log("saved png");
      });
    });
    return {statsTableULR: "statsTable.png"};
  }

  private getName(account_id: number): string {
    //shitty to test with hard wired config files
    const knownPlayer = HansConfig.players.find(p => p.account_id === account_id);
    if (knownPlayer) {
      return knownPlayer.name;
    } else {
      //TODO: resolve steam account name
      return "Unknown player";
    }
  }
}


