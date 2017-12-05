import {AnalysisFormat, AnalysisType, Analyzer, AsyncAnalyzer} from "../hans.types";
import {DotaApiMatchResult, Player} from "../dota-api";
import {Analysis} from "../analysis";
import ItemStats = AnalysisFormat.ItemStats;
import {HansConfig} from "../hans.config";
import {items} from "../items";
import {Db} from "mongodb";

export class ItemStatsAnalyzer implements AsyncAnalyzer {

  private didIRun = false;

  analysisType = AnalysisType.ITEMSTATS;

  constructor(private db: Db, private config: HansConfig) {
  }

  private itemThresholds = [
    {item: 46, threshold: 1}
  ];

  analyze(matchInfo: DotaApiMatchResult, analysis: Analysis): Promise<ItemStats[]> {
    if (this.didIRun) {
      return undefined;
    }

    const ourPlayers = matchInfo.players.filter(p => this.config.getPlayers().find(us => us.account_id === p.account_id));

    return this.db.collection("itemstats").find().toArray().then(savedStats => {
        const itemStats: ItemStats[] = [];
        this.itemThresholds.forEach(itemThreshold => {
            ourPlayers.forEach(player => {
              const stat = savedStats.find(stat => stat.item === itemThreshold.item && stat.account_id === player.account_id);
              const itemStat = this.didPlayerReachThreshold(itemThreshold, player, stat.amount);
              if (itemStat) {
                itemStats.push(itemStat);
              }
            });
          }
        );
        this.didIRun = true;
        return itemStats;
      }
    );
  }

  private didPlayerReachThreshold(itemThreshold: { item: number; threshold: number }, player: Player, currentAmount: number): ItemStats {
    if (this.doesInventoryContainItem(player, itemThreshold.item)) {
      currentAmount++;
      this.db.collection("itemstats")
        .updateOne(
          {account_id: player.account_id, item: itemThreshold.item},
          {$set: {amount: currentAmount}}
        );
    }
    if (currentAmount % itemThreshold.threshold === 0 && currentAmount !== 0) {
      let item = items.find(item => item.id === itemThreshold.item).name;
      if (!item) {
        item = "unknown";
      } else {
        item = item.split("_")[1];
      }
      return {
        player: this.config.getPlayerNameById(player.account_id),
        item: item,
        amount: currentAmount
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
