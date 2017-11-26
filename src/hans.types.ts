import {DotaApiMatchResult} from "./dota-api";
import {Analysis} from "./analysis";

//received via http from dota clients
export class GameStateIntegrationMessage {
  match_id: number;
}

export type MatchId = number;
export type MessageId = number;
export type UserId = number;

export enum AnalysisType {
  ITEMSTATS,
  NAMERESOLVER,
  STATSTABLE,
  WHOWON,
  RATING,
  RUSSIAN
}

export class TelegramMessage {

}

export interface AsyncAnalyzer {
  analysisType: AnalysisType;

  analyze(matchInfo: DotaApiMatchResult, analysis: Analysis): Promise<any>;
}

export interface Analyzer {
  analysisType: AnalysisType;

  analyze(matchInfo: DotaApiMatchResult, analysis: Analysis): any;
}

export declare namespace AnalysisFormat {
  type Rating = Map<UserId, string>;
  interface WhoWon {
    won: boolean;
    duration: number;
    mode: string;
    ranked: boolean;
    players: string[];
    matchId: MatchId;
  }
  interface RussianAnalysis {
    totalPercentage: number;
    nonTeamMemberPercentage: number;
  }
  interface ItemStats {
    player: string;
    item: string;
    amount: number;
  }
}
