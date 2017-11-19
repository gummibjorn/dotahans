import {createCanvas, loadImage} from "canvas";

interface TablePlayer {
  hero: number;
  name?: string;
  kills: number;
  deaths: number;
  assists: number;
  level: number;
}

const width = 300;
const line_height = 30;
const radiantColor = "#92A525";
const direColor = "red";

export class CanvasTableDrawer {
  private players: TablePlayer[] = [];
  private xOffset = 0;
  private yOffset = 0;

  constructor(private winner: string, private duration: string, private radiantScore: number, private direScore: number) {
  }

  addPlayer(player: TablePlayer) {
    this.players.push(player);
  }

  async draw() {
    const canvas = createCanvas(width, 12 * line_height + 10);
    const ctx = canvas.getContext("2d");
    this.drawHeader(ctx);
    this.players.forEach((p, i) => this.drawPlayer(ctx, p, i));
    return canvas;
  }

  getWinnerColor(): string {
    return this.winner === "Radiant" ? radiantColor : direColor;
  }

  drawHeader(ctx) {
    ctx.beginPath();
    ctx.rect(0, 0, width, 75);
    ctx.fillStyle = "#1C242D";
    ctx.fill();

    ctx.textAlign = "center";
    ctx.font = "28px Arial";
    this.newLine();
    ctx.fillStyle = this.getWinnerColor();
    ctx.fillText(`${this.winner} won`, width / 2, this.yOffset);
    this.newLine();

    ctx.font = "20px Arial";
    ctx.fillStyle = radiantColor;
    ctx.fillText(`${this.radiantScore}`, width / 2 - 50, this.yOffset);

    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    ctx.fillText(`${this.duration}`, width / 2, this.yOffset);

    ctx.font = "20px Arial";
    ctx.fillStyle = direColor;
    ctx.fillText(`${this.direScore}`, width / 2 + 50, this.yOffset);
    this.yOffset = 75;
  }

  private light = true;

  private toggleFillColor(): string {
    if (this.light) {
      this.light = false;
      return "#2d3a47";
    } else {
      this.light = true;
      return "#272e38";
    }
  }

  //first 5 players must be radiant
  async drawPlayer(ctx, player: TablePlayer, index: number) {

    const image = await loadImage(`img/hero${player.hero}.png`);

    ctx.beginPath();
    ctx.rect(this.xOffset, this.yOffset, width, line_height);
    ctx.fillStyle = this.toggleFillColor();
    ctx.fill();

    ctx.font = "15px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "start";
    ctx.fillStyle = index < 5 ? radiantColor : direColor;
    ctx.drawImage(image, this.xOffset, this.yOffset, 50, line_height);
    this.xOffset += 70;

    ctx.fillText(player.name || "-", this.xOffset, this.yOffset + line_height / 2, 100);
    this.xOffset += 110;

    ctx.fillText(player.level, this.xOffset, this.yOffset + line_height / 2);
    this.xOffset += 50;

    ctx.fillText(`${player.kills} / ${player.deaths} / ${player.assists}`, this.xOffset, this.yOffset + line_height / 2);
    this.newLine();
  }

  newLine() {
    this.xOffset = 0;
    this.yOffset += line_height;
  }

}
