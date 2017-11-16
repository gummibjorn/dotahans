import {} from "jest";
import {Poller} from "../src/poller";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";

class MatchManagerSpy {
  onMatchFinished = jest.fn();
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

  it("Should call onMatchFinished after polling new match", () => {
    poller.poll();
    expect(matchManager.onMatchFinished.mock.calls.length).toBe(1);
  });

  it("Should call onMatchFinished only once for duplicated matches", () => {
    poller.poll();
    poller.poll();
    expect(matchManager.onMatchFinished.mock.calls.length).toBe(1);
  });
});
