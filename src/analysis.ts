import {MatchManager} from "./matchManager";
import {Subject} from "rxjs/Subject";
import {Analysis, AnalysisTypeEnum, Match, MatchId} from "./hans.types";


export class AnalysisMaker {

  complete: Subject<Analysis> = new Subject();
  private analysis: Map<MatchId, Analysis>;

  constructor(gameManager: MatchManager) {
    gameManager.endOfMatch.subscribe(game => {
      this.startSyncAnalysis(game);
      //sync analysis
      //aysnc analyse
    });
  }

  private startSyncAnalysis(game: Match) {
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

  analyze(matchInfo: Match): any;
}

class DetermineWhoWonAnalyzer implements Analyzer {
  analysisType = AnalysisTypeEnum.WHOWON;

  analyze(matchInfo: Match): any {
    return undefined;
  }
}
