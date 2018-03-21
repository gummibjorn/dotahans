import {} from "jest";
import {ExcuseGenerator} from "../src/analyzers/excuse.analyzer";

describe("Excuse Generator", () => {
  it("should make an excuse", () => {
    const generator = new ExcuseGenerator(['Sniper'], ['Mario']);
    for(let i = 0; i<100; i++){
      console.log(generator.randomExcuse());
    }
    //expect(msg).toBe("Hans, Franz won Ranked All Pick after 22:17 [OD](https://www.opendota.com/matches/123) [DB](https://www.dotabuff.com/matches/123)")
  });
});
