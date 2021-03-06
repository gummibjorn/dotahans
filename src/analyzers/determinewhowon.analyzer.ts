import {AnalysisFormat, AnalysisType, Analyzer} from "../hans.types";
import {DotaApiMatchResult, Player} from "../dota-api";
import {Account} from "../hans.types";
import WhoWon = AnalysisFormat.WhoWon;
import {Analysis} from "../analysis";

export const statsPages = {
  "OD": "https://www.opendota.com/matches/:id:",
  "DB": "https://www.dotabuff.com/matches/:id:"
};

export const gameModes = {
  0: "None",
  1: "All Pick",
  2: "Captain's Mode",
  3: "Random Draft",
  4: "Single Draft",
  5: "All Random",
  6: "Intro",
  7: "Diretide",
  8: "Reverse Captain's Mode",
  9: "The Greeviling",
  10: "Tutorial",
  11: "Mid Only",
  12: "Least Played",
  13: "New Player Pool",
  14: "Compendium Matchmaking",
  16: "Captains Draft",
  18: "Ability Draft",
  20: "All Random Death Match",
  21: "1v1 Solo Mid",
  22: "All Pick",
  23: "Turbo"
};

export class DetermineWhoWon implements Analyzer {
  analysisType = AnalysisType.WHOWON;

  constructor(private players: Account[], private goons: Account[]){}

  analyze(matchInfo: DotaApiMatchResult, analysis: Analysis): WhoWon {
    return {
      won: this.didWeWin(matchInfo),
      duration: matchInfo.duration,
      mode: gameModes[matchInfo.game_mode] || "something",
      ranked: matchInfo.lobby_type === 7,
      players: this.getOurPlayerNames(matchInfo.players),
      goons: this.getGoonNames(matchInfo.players),
      matchId: matchInfo.match_id
    };
  }

  private getNames(playersInMatch: Player[], accountsToFind: Account[]): string[] {
    return playersInMatch.map(p => {
      for (const account of accountsToFind) {
        if (account.account_id === p.account_id) {
          return account.name;
        }
      }
      return null;
    }).filter(name => name !== null);
  }

  //if we want account names here, we should query the dota api for them on startup and cache the names
  private getOurPlayerNames(players: Player[]): string[] {
    return this.getNames(players, this.players);
  }

  private getGoonNames(players: Player[]): string[] {
    return this.getNames(players, this.goons);
  }

  private didWeWin(matchInfo): boolean {
    return this.areWeRadiant(matchInfo.players) ? matchInfo.radiant_win : !matchInfo.radiant_win;
  }

  private areWeRadiant(players: Player[]): boolean {
    let areWeRadiant = false;
    this.players.forEach(player => {
      const firstKnownPlayer = players.find(p => p.account_id === player.account_id);
      if (firstKnownPlayer) {
        areWeRadiant = firstKnownPlayer.player_slot < 5;
        return;
      }
    });
    return areWeRadiant;
  }
}
