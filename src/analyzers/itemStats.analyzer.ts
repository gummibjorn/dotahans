import {AnalysisFormat, AnalysisType, Analyzer} from "../hans.types";
import {DotaApiMatchResult, Player} from "../dota-api";
import {Analysis} from "../analysis";
import ItemStats = AnalysisFormat.ItemStats;
import {HansConfig} from "../hans.config";

export class ItemStatsAnalyzer implements Analyzer {
  analysisType = AnalysisType.ITEMSTATS;

  private itemThresholds = [
    {item: 46, threshold: 1}
  ];

  analyze(matchInfo: DotaApiMatchResult, analysis: Analysis): ItemStats[] {
    const ourPlayers = matchInfo.players.filter(p => HansConfig.players.find(us => us.account_id === p.account_id));

    const itemStats: ItemStats[] = [];
    this.itemThresholds.forEach(itemThreshold => {
        ourPlayers.forEach(player => {
          const itemStat = this.didPlayerReachThreshold(itemThreshold, player);
          if (itemStat) {
            itemStats.push(itemStat);
          }
        });
      }
    );
    console.log(itemStats)
    return itemStats;
  }

  private didPlayerReachThreshold(itemThreshold: { item: number; threshold: number }, player: Player): ItemStats {
    //TODO: get current amount from db
    let currentAmount = 0;
    if (this.doesInventoryContainItem(player, itemThreshold.item)) {
      currentAmount++;
    }
    if (currentAmount % itemThreshold.threshold === 0) {
      return {
        player: "Mario",
        item: "Iron talon",
        amount: 1000
      };
    }
  }

  private doesInventoryContainItem(player: Player, item: number): boolean {
    return player.item_0 === item
      || player.item_1 === item
      || player.item_2 === item
      || player.item_3 === item
      || player.item_4 === item
      || player.item_5 === item
      || player.backpack_0 === item
      || player.backpack_1 === item
      || player.backpack_2 === item;
  }
}
