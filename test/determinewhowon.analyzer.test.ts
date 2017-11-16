import {} from "jest";
import {DetermineWhoWonAnalyzer} from "../src/analyzers/determinewhowon.analyzer";
import {matchResult} from "./testMatchResult";

describe("DetermineWhoWonAnalyzer", () => {
  let determineWhoWonAnalyzer: DetermineWhoWonAnalyzer;

  beforeEach(() => {
    determineWhoWonAnalyzer = new DetermineWhoWonAnalyzer();
  });

  it("Configured players should win", () => {
    expect(determineWhoWonAnalyzer.analyze(matchResult).won).toBeTruthy();
  });

});
