import {createCanvas, loadImage } from "canvas";

interface TablePlayer{
  hero: number;
  name?: string;
  kills: number;
  deaths: number;
  assists: number;
}

const width = 300;
const line_height = 30;

export class CanvasTableDrawer {
  private players : TablePlayer[] = [];
  private xOffset = 0;
  private yOffset = 0;

  constructor(private winner: string, private time: number){}

  addPlayer(player: TablePlayer) {
    this.players.push(player);
  }

  async draw(){
    const canvas = createCanvas(width, 12*line_height)
    const ctx = canvas.getContext('2d');
    this.drawHeader(ctx);
    this.players.forEach(p => this.drawPlayer(ctx, p))
    return canvas;
  }

  async drawHeader(ctx) {
    ctx.fillText(`${this.winner} win`, this.xOffset, this.yOffset, width);
    this.newLine();
    ctx.fillText(`${this.time}`, this.xOffset, this.yOffset, width);
    this.newLine();
  }

  async drawPlayer(ctx, player: TablePlayer){
    const image = await loadImage(`img/hero${player.hero}.png`);
    ctx.drawImage(image, this.xOffset, this.yOffset, 50, line_height);
    this.xOffset += 60;

    ctx.fillText(player.name || "-", this.xOffset, this.yOffset, 100);
    this.xOffset += 110;

    ctx.fillText(`${player.kills} / ${player.deaths} / ${player.assists}`, this.xOffset, this.yOffset);
    this.newLine()
  }

  newLine(){
    this.xOffset = 0;
    this.yOffset += line_height;
  }

}
