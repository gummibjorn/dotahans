import {} from "jest";
import {MatchManager} from "../src/matchManager";

describe("MatchManager", () => {
  it("should be created", () => {
    const matchManager = new MatchManager();
    expect(matchManager).toBeDefined();
  });
});
