import {} from "jest";
import {CanvasTableDrawer} from "../src/analyzers/canvasStatsTable";
import * as fs from "fs";

describe("Canvas Stats Table", () => {
  it("should be drawn", (done) => {
    const drawer = new CanvasTableDrawer("Radiant", 1234);
    drawer.addPlayer({hero: 1, kills: 5, deaths: 3, assists: 17, name: "Hans"});
    drawer.addPlayer({hero: 2, kills: 8, deaths: 14, assists: 3, name: "Peter"});
    drawer.addPlayer({hero: 4, kills: 19, deaths: 0, assists: 2, name: "Gurken"});
    drawer.addPlayer({hero: 9, kills: 0, deaths: 0, assists: 0});
    drawer.addPlayer({hero: 9, kills: 0, deaths: 0, assists: 0});
    drawer.addPlayer({hero: 9, kills: 0, deaths: 0, assists: 0});
    drawer.addPlayer({hero: 9, kills: 0, deaths: 0, assists: 0});
    drawer.addPlayer({hero: 9, kills: 0, deaths: 0, assists: 0});

    drawer.draw().then(canvas => {
      const stream = canvas.pngStream();
      const out = fs.createWriteStream(__dirname + "/test.png");
      stream.on('data', function(chunk){
        out.write(chunk);
      });

      stream.on('end', function(){
        console.log('saved png');
        done();
      });
    })
  });
});
