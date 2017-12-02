import {} from "jest";
import {Russian} from "../src/analyzers/russian.analyzer";
import {matchResult} from "./testMatchResult";

describe("Russian", () => {
  let russianAnalyzer: Russian;

  beforeEach(() => {
    russianAnalyzer = new Russian();
  });

  /*it("Percentage of russians", () => {
    expect(russianAnalyzer.analyze(matchResult, undefined)).toBe(0);
  });*/

});
