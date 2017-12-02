import {} from "jest";
import {Russian} from "../src/analyzers/russian.analyzer";
import {matchResult} from "./testMatchResult";
import {DotaApi} from "../src/dota.api";
import {MatchManager} from "../src/matchManager";
import * as TelegramBot from "node-telegram-bot-api";
import {AnalysisMaker} from "../src/analysis";
import {MessageSender} from "../src/messageSender";
import {TelegramRating} from "../src/telegramRating";
import * as dotenv from "dotenv";

/*describe("Russian", () => {
  let russianAnalyzer: Russian;

  beforeEach(() => {
    russianAnalyzer = new Russian();
  });

  it("Percentage of russians", () => {
    expect(russianAnalyzer.analyze(matchResult, undefined)).toBe(0);
  });

});*/

describe("Integration", () => {
  it("Send telegram message", () => {
    dotenv.config({path: ".env"});
    const messageMatchMap: any = {};

    const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});
    const matchManager = new MatchManager();
    const analysisMaker = new AnalysisMaker(matchManager, new DotaApi());
    const messageSender = new MessageSender(analysisMaker, messageMatchMap, bot);
    const telegramRating = new TelegramRating(analysisMaker, messageSender, bot);
    matchManager.onMatchFinished(matchResult);

    expect(matchManager).toBeTruthy();
  });
});
