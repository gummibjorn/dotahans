import {} from "jest";
import {CanvasTableDrawer} from "../src/analyzers/canvasStatsTable";
import * as fs from "fs";

describe("Canvas Stats Table", () => {
  it("should be drawn", (done) => {
    const drawer = new CanvasTableDrawer("Mir händ gwunne", "12:12", 10, 24, true);
    drawer.addPlayer({hero: 1, kills: 5, deaths: 3, assists: 17, level: 25, name: "Hans"});
    drawer.addPlayer({hero: 2, kills: 8, deaths: 14, assists: 3, level: 22, name: "Peter"});
    drawer.addPlayer({hero: 4, kills: 19, deaths: 0, assists: 2, level: 21, name: "Gurken"});
    drawer.addPlayer({hero: 12, kills: 8, deaths: 14, assists: 3, level: 19, name: "Sellerie"});
    drawer.addPlayer({hero: 19, kills: 1, deaths: 287, assists: 0, level: 2, name: "Pflume"});

    drawer.addPlayer({hero: 39, kills: 19, deaths: 0, assists: 2, level: 9, name: "Chürbis"});
    drawer.addPlayer({hero: 28, kills: 5, deaths: 3, assists: 17, level: 15, name: "Rüebli"});
    drawer.addPlayer({hero: 87, kills: 8, deaths: 14, assists: 3, level: 4, name: "Öpfel"});
    drawer.addPlayer({hero: 10, kills: 19, deaths: 0, assists: 2, level: 99, name: "Tomate"});
    drawer.addPlayer({hero: 8, kills: 5, deaths: 3, assists: 17, level: 1, name: "Chabis"});

    drawer.draw().then(canvas => {
      const stream = canvas.pngStream();
      const out = fs.createWriteStream(__dirname + "/test.png");
      stream.on('data', function (chunk) {
        out.write(chunk);
      });

      stream.on('end', function () {
        console.log('saved png');
        done();
      });
    });
  });
});
