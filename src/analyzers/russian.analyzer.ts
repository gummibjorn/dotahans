import {AnalysisFormat, AnalysisType, AsyncAnalyzer} from "../hans.types";
import {DotaApiMatchResult} from "../dota-api";
import {Analysis} from "../analysis";
import RussianAnalysis = AnalysisFormat.RussianAnalysis;

export class Russian implements AsyncAnalyzer {
  analysisType = AnalysisType.RUSSIAN;

  analyze(matchInfo: DotaApiMatchResult, analysis: Analysis): Promise<RussianAnalysis> {
    if (!this.didDependantAnalyzersRun(analysis) || this.didIRun(analysis)) {
      return undefined;
    }

    const playerSummaryTuples = analysis.get(AnalysisType.NAMERESOLVER).playerSummaries;
    let russianCount = 0;
    playerSummaryTuples.forEach(p => {
      if (p.playerSummary.loccountrycode === "RU") {
        russianCount++;
      }
    });

    const result: RussianAnalysis = {
      totalPercentage: russianCount * 10,
      nonTeamMemberPercentage: 0
    };

    return Promise.resolve(result);
  }

  private didDependantAnalyzersRun(analysis: Analysis): boolean {
    return analysis.get(AnalysisType.NAMERESOLVER);
  }

  private didIRun(analysis: Analysis): boolean {
    return analysis.get(this.analysisType);
  }
}
