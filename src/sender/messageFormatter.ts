import {AnalysisFormat, AnalysisType} from "../hans.types";
import Rating = AnalysisFormat.Rating;
import WhoWon = AnalysisFormat.WhoWon;
import {duration} from "moment";
import {statsPages} from "../analyzers/determinewhowon.analyzer";
import ItemStats = AnalysisFormat.ItemStats;
import Excuse = AnalysisFormat.Excuse;
import {Analysis} from "../analysis";

export function format(analysis: Analysis): string {
  return [
    whoWon,
    itemStats,
    excuse,
    rating
  ].map((f: Formatter) => analysis.formatPart(f.type, f.format))
    .filter(s => s !== null && s.trim() != "")
    .join("\n\n");
}

export interface Formatter {
  type: AnalysisType,
  format: (data: any) => string
}

function makeFormatter(type: AnalysisType, format: (data: any) => string) {
  return ({type, format});
}

export const rating = makeFormatter(AnalysisType.RATING, (rating: Rating) => {
  let msg = "";
  //for some reason, Map.entries() refuses to work
  for (const userid of Object.keys(rating)) {
    const r = rating[userid];
    msg += `${r}`;
  }
  return msg;
});

export const whoWon = makeFormatter(AnalysisType.WHOWON, (whoWon: WhoWon) => {
  const durationFormat = duration(whoWon.duration, "seconds").format("hh:mm:ss");
  const wonLost = whoWon.won ? "won" : "lost";
  const ranked = whoWon.ranked ? "Ranked " : "";
  const stats = Object.keys(statsPages)
    .map(key => `[${key}](${statsPages[key].replace(":id:", whoWon.matchId)})`)
    .join(" ");
  return `${whoWon.players.join(", ")} ${wonLost} ${ranked}${whoWon.mode} after ${durationFormat} ${stats}`;
});

export const itemStats = makeFormatter(AnalysisType.ITEMSTATS, (itemStats: ItemStats[]) => {
  let outString = "";
  itemStats.forEach(stats => {
    outString += `${stats.player} built his ${stats.amount} ${stats.item}` + "\n";
  });
  return outString;
});

export const excuse = makeFormatter(AnalysisType.EXCUSE, (excuse: Excuse)=> excuse.excuse);
