import {MatchManager} from "./matchManager";
import {Subject} from "rxjs/Subject";
import {Analysis, AnalysisTypeEnum, Analyzer, MatchId} from "./hans.types";
import {DotaApiMatchResult} from "./dota-api";
import {DetermineWhoWon} from "./analyzers/determinewhowon.analyzer";
import {StatsTable} from "./analyzers/statsTable.analyzer";

export class AnalysisMaker {

  complete: Subject<Analysis> = new Subject();
  private analysis = new Map<MatchId, Analysis>();

  constructor(matchManager: MatchManager) {
    matchManager.endOfMatch.subscribe(match => {
      this.startSyncAnalysis(match);
      //sync analysis
      //aysnc analyse
    });
  }

  private startSyncAnalysis(match: DotaApiMatchResult) {
    const analyzers: Analyzer[] = [new DetermineWhoWon(), new StatsTable()];
    const analyse: Analysis = new Map<AnalysisTypeEnum, any>();
    analyzers.forEach(analyzer => {
      analyse[analyzer.analysisType] = analyzer.analyze(match);
    });
    this.analysis.set(match.match_id, analyse);
    this.complete.next(analyse);
  }
}

