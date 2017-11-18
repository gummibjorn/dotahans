import {MatchManager} from "./matchManager";
import {Subject} from "rxjs/Subject";
import {AnalysisTypeEnum, Analyzer, MatchId, UserId} from "./hans.types";
import {DotaApiMatchResult} from "./dota-api";
import {DetermineWhoWon} from "./analyzers/determinewhowon.analyzer";
import {StatsTable} from "./analyzers/statsTable.analyzer";

export class Analysis{
  private parts : Map<AnalysisTypeEnum, any> = new Map();

  constructor(private matchId: MatchId){}

  getPart(type : AnalysisTypeEnum, creator = ()=>null){
    let part = this.parts[type];
    if(part === undefined){
      part = creator()
      this.parts[type] = part;
    }
    return part;
  }

  formatPart(type: AnalysisTypeEnum, formatter) : string{
    const part = this.parts[type];
    if(part === undefined){
      return "";
    } else {
      return formatter(part);
    }
  }

  setPart(type : AnalysisTypeEnum, part){
    this.parts[type] = part;
  }

  getMatchId = () => this.matchId

}

export class AnalysisMaker {

  complete: Subject<Analysis> = new Subject();
  private analysises = new Map<MatchId, Analysis>();

  constructor(matchManager: MatchManager) {
    matchManager.endOfMatch.subscribe(match => {
      this.startSyncAnalysis(match);
      //sync analysis
      //aysnc analyse
    });
  }

  public externalAnalysis(matchId: MatchId, type: AnalysisTypeEnum, data: any){
    const a = this.getAnalysis(matchId);
    a.setPart(type, data);
    this.complete.next(a);
  }

  public updateRating(matchId : MatchId, userId: UserId, rating: string){
    const analysis = this.getAnalysis(matchId);
    let ratings = analysis.getPart(AnalysisTypeEnum.RATING, ()=>new Map())
    ratings[userId] = rating;
    this.complete.next(analysis)
  }

  private getAnalysis(matchId : MatchId){
    let analysis = this.analysises[matchId];
    if(analysis === undefined){
      analysis = new Analysis(matchId);
      this.analysises[matchId] = analysis;
    }
    return analysis;
  }

  private startSyncAnalysis(match: DotaApiMatchResult) {
    const analyzers: Analyzer[] = [
      new DetermineWhoWon(),
      new StatsTable()
    ];
    const analysis: Analysis = new Analysis(match.match_id);
    analyzers.forEach(analyzer => {
      analysis.setPart(analyzer.analysisType, analyzer.analyze(match));
    });
    this.analysises.set(match.match_id, analysis);
    this.complete.next(analysis);
  }
}

