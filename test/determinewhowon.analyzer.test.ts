import {} from "jest";
import {DetermineWhoWon} from "../src/analyzers/determinewhowon.analyzer";
import {matchResult} from "./testMatchResult";
import {HansConfig} from "../src/hans.config";

describe("DetermineWhoWon", () => {
  let determineWhoWonAnalyzer: DetermineWhoWon;

  beforeEach(() => {
    determineWhoWonAnalyzer = new DetermineWhoWon([{name: "Mario", account_id: 56706937}]);
  });

  it("Configured players should win", () => {
    expect(determineWhoWonAnalyzer.analyze(matchResult, undefined).won).toBeTruthy();
  });

});
