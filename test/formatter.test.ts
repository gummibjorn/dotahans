import {} from "jest";
import {whoWon} from "../src/sender/messageFormatter";

describe("WhoWonFormat", () => {
  it("should format a win", () => {
    const msg = whoWon.format({
      won: true,
      duration: 1337,
      mode: "All Pick",
      ranked: true,
      players: ["Hans", "Franz"],
      matchId: 123
    })
    expect(msg).toBe("Hans, Franz won Ranked All Pick after 22:17 [OD](https://www.opendota.com/matches/123) [DB](https://www.dotabuff.com/matches/123)")
  });
});
