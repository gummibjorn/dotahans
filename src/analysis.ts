import {GameManager} from "./gameManager";

type MatchId = string;

type Analysis = Map<AnalysisTypeEnum, any>;

class AnalysisMaker {

  private analysis: Map<MatchId, Analysis>;
  complete: Subject<Analysis>;

  constructor(gameManager: GameManager) {
    gameManager.endOfGame.subscribe(game => {
      //sync analysis
      //aysnc analyse
    });
  }

  startSyncAnalysis() {
    const analyzers = [new WhoWonAnalyzer()];
    const analysis = new Map();
    analyzers.forEach(analyzer => {
      analysis[analyzer.getType()] = analyzer.analyze(game);
    });
    complete.next(analysis);
  }

}

interface Analyzer {
  getType(): string

  analyze(matchInfo: Game): Analysis
}

class DetermineWhoWonAnalyzer implements Analyzer {
  getType() => 'determineWhoWon';

  analyzer(matchInfo: Game): WhoWonAnalysis {

  }
}
