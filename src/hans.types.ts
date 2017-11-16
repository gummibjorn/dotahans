export class Match {
  private matchId: number;
}

//received via http from dota clients
export class GameStateIntegrationMessage {

}

//inserted from the poller, when it detected a finished game from the dota api
export class DotaAPIMatchMessage {

}

export type MatchId = number;

export enum AnalysisTypeEnum {
  WHOWON
}

export type Analysis = Map<AnalysisTypeEnum, any>;

export class TelegramMessage {

}
