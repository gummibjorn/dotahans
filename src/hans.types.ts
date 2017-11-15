export class Game {
  private matchId: number;
}

//received via http from dota clients
export class GameStateIntegrationMessage {

}

//inserted from the poller, when it detected a finished game from the dota api
export class DotaAPIMatchMessage {

}

export type MatchId = string;

export enum AnalysisTypeEnum {
  WHOWON
}

export type Analysis = Map<AnalysisTypeEnum, any>;

export class TelegramMessage {

}
