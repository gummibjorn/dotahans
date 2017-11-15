import {Game, GameManager} from "./gameManager";
import {Subject} from "rxjs/Subject";

type MatchId = string;

enum AnalysisTypeEnum {
  WHOWON
}

export type Analysis = Map<AnalysisTypeEnum, any>;

export class AnalysisMaker {

  complete: Subject<Analysis> = new Subject();
  private analysis: Map<MatchId, Analysis>;

  constructor(gameManager: GameManager) {
    gameManager.endOfGame.subscribe(game => {
      this.startSyncAnalysis(game);
      //sync analysis
      //aysnc analyse
    });
  }

  private startSyncAnalysis(game: Game) {
    const analyzers: Analyzer[] = [new DetermineWhoWonAnalyzer()];
    const analyse = new Map<AnalysisTypeEnum, any>();
    analyzers.forEach(analyzer => {
      analyse[analyzer.analysisType] = analyzer.analyze(game);
    });
    this.complete.next(analyse);
  }
}

interface Analyzer {
  analysisType: AnalysisTypeEnum;

  analyze(matchInfo: Game): any;
}

class DetermineWhoWonAnalyzer implements Analyzer {
  analysisType = AnalysisTypeEnum.WHOWON;

  analyze(matchInfo: Game): any {
    return undefined;
  }
}
