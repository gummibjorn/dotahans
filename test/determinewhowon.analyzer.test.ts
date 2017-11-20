import {} from "jest";
import {DetermineWhoWon} from "../src/analyzers/determinewhowon.analyzer";
import {matchResult} from "./testMatchResult";
import {Analysis} from "../src/analysis";

describe("DetermineWhoWon", () => {
  let determineWhoWonAnalyzer: DetermineWhoWon;

  beforeEach(() => {
    determineWhoWonAnalyzer = new DetermineWhoWon();
  });

  it("Configured players should win", () => {
    expect(determineWhoWonAnalyzer.analyze(matchResult, new Analysis(undefined)).won).toBeTruthy();
  });

});
