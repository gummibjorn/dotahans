import {DotaApiMatchResult} from "./dota-api";

//received via http from dota clients
export class GameStateIntegrationMessage {
  match_id: number;
}

export type MatchId = number;
export type MessageId = number;
export type UserId = number;

export enum AnalysisTypeEnum {
  STATSTABLE,
  WHOWON
}

export type Analysis = Map<AnalysisTypeEnum, any>;

export class TelegramMessage {

}


export interface Analyzer {
  analysisType: AnalysisTypeEnum;

  analyze(matchInfo: DotaApiMatchResult): any;
}
