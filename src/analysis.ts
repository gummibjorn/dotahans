import {MatchManager} from "./matchManager";
import {Subject} from "rxjs/Subject";
import {AnalysisType, Analyzer, AsyncAnalyzer, MatchId, UserId} from "./hans.types";
import {DotaApiMatchResult} from "./dota-api";
import {DetermineWhoWon} from "./analyzers/determinewhowon.analyzer";
import {StatsTable} from "./analyzers/statsTable.analyzer";
import {DotaApi} from "./dota.api";
import {PlayerSummaryResolver} from "./analyzers/playerSummaryResolver.analyzer";
import {HansConfig} from "./hans.config";

export class Analysis {
  private parts: Map<AnalysisType, any> = new Map();

  constructor(private matchId: MatchId) {
  }

  get(type: AnalysisType) {
    return this.parts[type];
  }

  getPart(type: AnalysisType, creator = () => undefined) {
    let part = this.parts[type];
    if (part === undefined) {
      part = creator();
      this.parts[type] = part;
    }
    return part;
  }

  formatPart(type: AnalysisType, formatter: (any: any) => string): string {
    const part = this.parts[type];
    if (part === undefined) {
      return "";
    } else {
      return formatter(part);
    }
  }

  setPart(type: AnalysisType, part) {
    this.parts[type] = part;
  }

  getMatchId = () => this.matchId;
}

export class AnalysisMaker {

  complete: Subject<Analysis> = new Subject();
  private analysises = new Map<MatchId, Analysis>();

  constructor(matchManager: MatchManager, private dotaApi: DotaApi, private config: HansConfig) {
    matchManager.endOfMatch.subscribe(match => {
      this.startSyncAnalysis(match);
      this.startAsyncAnalysis(match);
    });
  }

  public externalAnalysis(matchId: MatchId, type: AnalysisType, data: any) {
    const a = this.getAnalysis(matchId);
    a.setPart(type, data);
    this.complete.next(a);
  }

  public updateRating(matchId: MatchId, userId: UserId, rating: string) {
    const analysis = this.getAnalysis(matchId);
    const ratings = analysis.getPart(AnalysisType.RATING, () => new Map());
    ratings[userId] = rating;
    this.complete.next(analysis);
  }

  private getAnalysis(matchId: MatchId) {
    let analysis = this.analysises.get(matchId);
    if (analysis === undefined) {
      analysis = new Analysis(matchId);
      this.analysises.set(matchId, analysis);
    }
    return analysis;
  }

  private asyncAnalyzers: AsyncAnalyzer[] = [
    new PlayerSummaryResolver(this.dotaApi),
    new StatsTable(this.config.getPlayers()),
  ];

  private syncAnalyzers: Analyzer[] = [
    new DetermineWhoWon(this.config.getPlayers())
  ];

  private runAsyncAnalyzers(match: DotaApiMatchResult, analysis: Analysis) {
    this.asyncAnalyzers.forEach(analyzer => {
      const asyncResult = analyzer.analyze(match, analysis);
      if (asyncResult) {
        asyncResult.then(result => {
          analysis.setPart(analyzer.analysisType, result);
          this.complete.next(analysis);
        });
      }
    });
  }

  private startAsyncAnalysis(match: DotaApiMatchResult) {
    this.runAsyncAnalyzers(match, this.analysises.get(match.match_id));
    this.complete.subscribe(analysis => this.runAsyncAnalyzers(match, analysis) );
  }

  private startSyncAnalysis(match: DotaApiMatchResult) {
    const analysis: Analysis = new Analysis(match.match_id);
    this.syncAnalyzers.forEach(analyzer => {
      analysis.setPart(analyzer.analysisType, analyzer.analyze(match, analysis));
    });
    this.analysises.set(match.match_id, analysis);
    this.complete.next(analysis);
  }
}
