/**
 * Module dependencies.
 */
import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import * as lusca from "lusca";
import * as dotenv from "dotenv";
import * as flash from "express-flash";
import * as path from "path";
import * as passport from "passport";
import expressValidator = require("express-validator");
import * as TelegramBot from "node-telegram-bot-api";
import * as Redis from 'ioredis';

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({path: ".env"});


/**
 * Controllers (route handlers).
 */
import * as apiController from "./controllers/api";
import * as dashboard from "./controllers/dashboard";

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(express.static(path.join(__dirname, "public"), {maxAge: 31557600000}));

/*
 * Hans
 */
import {AnalysisMaker} from "./analysis";
import {MatchManager} from "./matchManager";
import {TelegramMessageSender} from "./sender/telegramMessageSender";
import {matchStream} from "./poller";
import {DotaApi} from "./dota.api";
import {TelegramRating} from "./telegramRating";
import {HansConfig} from "./hans.config";
import {format} from "./sender/messageFormatter";

const config = new HansConfig();
const dotaApi = new DotaApi(config.get("STEAM_API_KEY"));
const redis = new Redis(config.get('REDIS_URL'));

const matchManager = new MatchManager();
const analysisMaker = new AnalysisMaker(matchManager, dotaApi, config);

const isDebug = config.get("DEBUG", "FALSE") !== "FALSE";

function makeBot(debug: boolean){
  if(debug) {
    return new TelegramBot(config.get("TELEGRAM_TOKEN"), {polling: true});
  } else {
    const token = config.get("TELEGRAM_TOKEN");
    const url = config.get("PUBLIC_URL");
    const bot = new TelegramBot(token);
    bot.setWebHook(`${url}/bot${token}`);
    app.post(`/bot${token}`, (req, res) => {
      bot.processUpdate(req.body);
      res.sendStatus(200);
    });
    return bot;
  }
}

const bot = makeBot(isDebug);
bot.on("message", (msg) => {
  console.log(JSON.stringify(msg, undefined, 2));
  if(msg.text.startsWith("/hi")){
    bot.sendMessage(msg.chat.id, "Hello");
  }
});

const messageSender = new TelegramMessageSender(analysisMaker, config, bot);
const telegramRating = new TelegramRating(analysisMaker, messageSender, bot);

if(!isDebug){
  console.log("PRODUCTION MODE");
  // bot.sendMessage(Number(config.get("CHAT_ID")), "Hello");


  let pollIntervalSeconds = Number(config.get("POLL_INTERVAL_MS", "0")) / 1000;
  matchStream(dotaApi, config.getPlayers(), redis, pollIntervalSeconds).subscribe(match => matchManager.onMatchFinished(match));
  console.log(`Polling dota API every ${pollIntervalSeconds}s`);

} else {
  console.log("DEV MODE");
  redis.flushall();

  // matchStream(dotaApi, config.getPlayers(), redis, 0).subscribe(match => matchManager.onMatchFinished(match) );
  analysisMaker.complete.subscribe(analysis => console.log(format(analysis)), console.error);
  dotaApi.getMatchDetails(4179774334 ).subscribe(match => {
    console.log("GOT THE MATCH");
    matchManager.onMatchFinished(match);
  });

}

/*
updateGame(req, res) {
    gameManager.onGameUpdate(transfromToGameStateIntegrationMessage(req.body));
    res.ok);
}

telegramBot.onUpdate(({messageId: string, bonus: any}) => {
    const matchId = messageSender.getMatchId(messageId)
    analysis.botUpdate(matchId, bonus)
})*/


//app.post("/gamestate", (req, res) => gameManager.onGameUpdate(req.toJson()))

/**
 * Primary app routes.
 */
app.get("/", dashboard.index);

/**
 * API examples routes.
 */
app.get("/excuse", apiController.excuse(dotaApi));

app.get(`/check/:id`, (req, res) => {
  dotaApi.getMatchDetails(req.params.id).subscribe(match => {
    matchManager.onMatchFinished(match);
    res.sendStatus(200);
  });
});

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app;
