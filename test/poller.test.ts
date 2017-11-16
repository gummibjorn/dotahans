import {} from "jest";
import {Poller} from "../src/poller";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";

class MatchManagerSpy {
  onGameFinished = jest.fn();
}

class DotaApiStub {
  getLastMatch(playerId: number) {
    return Observable.of({match_id: 1});
  }
  getMatchDetails(matchId: number) {
    return Observable.of({match_id: 1});
  }
}

describe("Poller", () => {
  let matchManager;
  let poller;
  let dotaApi;

  beforeEach(() => {
    matchManager = new MatchManagerSpy();
    dotaApi = new DotaApiStub();
    poller = new Poller(matchManager, dotaApi);
  });

  it("Should call onGameFinished after polling new match", () => {
    poller.poll();
    expect(matchManager.onGameFinished.mock.calls.length).toBe(1);
  });

  it("Should call onGameFinished only once for duplicated matches", () => {
    poller.poll();
    poller.poll();
    expect(matchManager.onGameFinished.mock.calls.length).toBe(1);
  });
});
