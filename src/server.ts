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


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env.example" });


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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

/*
 * Hans
 */
import {AnalysisMaker} from "./analysis";
import {MatchManager} from "./matchManager";
import {MessageSender} from "./messageSender";

const messageMatchMap: any = {};
const telegramAPI: any = {};

const matchManager = new MatchManager();
const analysisMaker = new AnalysisMaker(matchManager);
const messageSender = new MessageSender(analysisMaker, messageMatchMap, telegramAPI);

/*
updateGame(req, res) {
    gameManager.onGameUpdate(transfromToGameStateIntegrationMessage(req.body));
    res.ok();
}

telegramBot.onUpdate(({messageId: string, bonus: any}) => {
    const matchId = messageSender.getMatchId(messageId)
    analysis.botUpdate(matchId, bonus)

})*/

//poller
/*
Set<MatchId> matches;
setInterval(
    config.players.forEach(p => {
        match = dotaApi.getLastMatch(p);
        if (!matches.contains(match)) {
            matches.add(match.id)
            gameManager.onGameFinished(transformToGameFInishMessage(match))
        }
    });
} }) 60000)
*/


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
  //TODO: add cronjob initiation here
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app;