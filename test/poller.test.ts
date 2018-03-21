import {} from "jest";
import {matchStream} from "../src/poller";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";
import {HansConfig} from "../src/hans.config";
import * as Redis from "ioredis";
import {Account} from "../src/hans.types";

class MatchManagerSpy {
  onMatchFinished = jest.fn();
}

class DotaApiStub {
  constructor(
    private matchMaker = (playerId: number)=> ({match_id: 1}),
    private detailMaker = (matchId: number)=> ({match_id: 1}),
  ){};

  getLastMatch(playerId: number) {
    return Observable.of(this.matchMaker(playerId));
  }
  getMatchDetails(matchId: number) {
    return Observable.of(this.matchMaker(matchId));
  }
}

function noop(){};

const Hans : Account = {name: "Hans", account_id: 1};
const Franz : Account = {name: "Franz", account_id: 2};

describe("Poller", () => {
  let matchManager;
  let stream;
  let dotaApi;
  let redis = new Redis();

  beforeEach(async () => {
    matchManager = new MatchManagerSpy();
    dotaApi = new DotaApiStub();
    const config = new HansConfig({PLAYERS: "Hans:1234"})
    await redis.flushall();
    stream = matchStream(dotaApi, config.getPlayers(), redis, 0);
  });

  it("Should yield one match for a single user", (done) => {
    let count = 0;
    stream.subscribe(()=>{
      count+=1;
    }, noop, ()=>{
      expect(count).toBe(1);
      done();
    });
  });

  it("Should yield one match if two users have the same match", done => {
    stream = matchStream(dotaApi, [Hans, Franz], redis, 0);
    let count = 0;
    stream.subscribe(()=>{
      count+=1;
    }, noop, ()=>{
      expect(count).toBe(1);
      done();
    });

  })
  it("should yield two matches if two users have differing matches", done => {
    dotaApi = new DotaApiStub((num) => ({match_id: num}));
    stream = matchStream(dotaApi, [Hans, Franz], redis, 0);
    let count = 0;
    stream.subscribe(()=>{
      count+=1;
    }, noop, ()=>{
      expect(count).toBe(2);
      done();
    });

  })
});
