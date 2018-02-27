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
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(express.static(path.join(__dirname, "public"), {maxAge: 31557600000}));

/*
 * Hans
 */
import {AnalysisMaker} from "./analysis";
import {MatchManager} from "./matchManager";
import {MessageSender} from "./messageSender";
import {Poller} from "./poller";
import {DotaApi} from "./dota.api";
import {TelegramRating} from "./telegramRating";
import {HansConfig} from "./hans.config";

const config = new HansConfig();

const messageMatchMap: any = {};
const dotaApi = new DotaApi(config.get("STEAM_API_KEY"));

const bot = new TelegramBot(config.get("TELEGRAM_TOKEN"), {polling: true});
bot.on("message", (msg) => {
  console.log(JSON.stringify(msg, undefined, 2));
  bot.sendMessage(msg.chat.id, "Hello dear penis");
});

const matchManager = new MatchManager();
const analysisMaker = new AnalysisMaker(matchManager, dotaApi, config);
const messageSender = new MessageSender(analysisMaker, messageMatchMap, bot);
const telegramRating = new TelegramRating(analysisMaker, messageSender, bot);

const poller = new Poller(matchManager, dotaApi, config.getPlayers());
const interval = Number(config.get("POLL_INTERVAL_MS", "0"));
if (interval > 0) {
  console.log(`Polling dota API every ${interval}ms`);
  setInterval(() => poller.poll(), interval);
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
app.get("/api", apiController.getApi);

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
