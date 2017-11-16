import {MatchManager} from "./matchManager";
import {Subject} from "rxjs/Subject";
import {Analysis, AnalysisTypeEnum, Analyzer, MatchId} from "./hans.types";
import {DotaApiMatchResult} from "./dota-api";
import {DetermineWhoWonAnalyzer} from "./analyzers/determinewhowon.analyzer";


export class AnalysisMaker {

  complete: Subject<Analysis> = new Subject();
  private analysis: Map<MatchId, Analysis>;

  constructor(matchManager: MatchManager) {
    matchManager.endOfMatch.subscribe(match => {
      this.startSyncAnalysis(match);
      //sync analysis
      //aysnc analyse
    });
  }

  private startSyncAnalysis(match: DotaApiMatchResult) {
    const analyzers: Analyzer[] = [new DetermineWhoWonAnalyzer()];
    const analyse: Analysis = new Map<AnalysisTypeEnum, any>();
    analyzers.forEach(analyzer => {
      analyse[analyzer.analysisType] = analyzer.analyze(match);
    });
    this.analysis.set(match.match_id, analyse);
    this.complete.next(analyse);
  }
}

