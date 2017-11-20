import {DotaApiMatchResult} from "./dota-api";
import {Analysis} from "./analysis";

//received via http from dota clients
export class GameStateIntegrationMessage {
  match_id: number;
}

export type MatchId = number;
export type MessageId = number;
export type UserId = number;

export enum AnalysisTypeEnum {
  STATSTABLE,
  WHOWON,
  RATING
}

export class TelegramMessage {

}


export interface Analyzer {
  analysisType: AnalysisTypeEnum;

  analyze(matchInfo: DotaApiMatchResult, analysis: Analysis): any;
}

export declare namespace AnalysisFormat {
  type Rating = Map<UserId, string>
  interface WhoWon {
    won: boolean;
    duration: number;
    mode: string;
    ranked: boolean;
    players: string[];
    matchId: MatchId;
  }
}
