import {createCanvas, loadImage} from "canvas";
import {Account} from "../hans.types";

interface TablePlayer {
  hero: number;
  name?: string;
  kills: number;
  deaths: number;
  assists: number;
  level: number;
}

const scaling_factor = 3;

const width = 300 * scaling_factor;
const line_height = 30 * scaling_factor;
const header_height = 75 * scaling_factor;
const team_score_offset = 50 * scaling_factor;
const player_image_width = 50 * scaling_factor;
const player_name_width = 85 * scaling_factor;

const player_name_xOffset = 60 * scaling_factor;
const player_level_xOffset = 110 * scaling_factor;
const player_stats_xOffset = 45 * scaling_factor;

const winning_text_font_size = 28 * scaling_factor;
const team_score_font_size = 20 * scaling_factor;
const duration_font_size = 15 * scaling_factor;
const player_text_font_size = 15 * scaling_factor;


const radiantColor = "#92A525";
const direColor = "red";

export class CanvasTableDrawer {
  private players: TablePlayer[] = [];
  private xOffset = 0;
  private yOffset = 0;

  constructor(private winner: string, private duration: string, private radiantScore: number, private direScore: number,
              private radiant_win: boolean, private knownPlayers: Account[]) {
  }

  addPlayer(player: TablePlayer) {
    this.players.push(player);
  }

  async draw() {
    const canvas = createCanvas(width, 10 * line_height + header_height);
    const ctx = canvas.getContext("2d");
    //load hero images before drawing
    const promises = [];
    this.players.forEach(p => promises.push(loadImage(`img/hero${p.hero}.png`)));

    return Promise.all(promises).then(
      images => {
        this.drawHeader(ctx);
        this.players.forEach((p, i) => {
          this.drawPlayer(ctx, p, i, images[i]);
        });
        return canvas;
      }
    );
  }

  getWinnerColor(): string {
    return this.radiant_win ? radiantColor : direColor;
  }

  drawHeader(ctx) {
    ctx.beginPath();
    ctx.rect(0, 0, width, header_height);
    ctx.fillStyle = "#1C242D";
    ctx.fill();

    ctx.textAlign = "center";
    ctx.font = `${winning_text_font_size}px Arial`;
    this.newLine();
    ctx.fillStyle = this.getWinnerColor();
    ctx.fillText(`${this.winner}`, width / 2, this.yOffset);
    this.newLine();

    ctx.font = `${team_score_font_size}px Arial`;
    ctx.fillStyle = radiantColor;
    ctx.fillText(`${this.radiantScore}`, width / 2 - team_score_offset, this.yOffset);

    ctx.fillStyle = "white";
    ctx.font = `${duration_font_size}px Arial`;
    ctx.fillText(`${this.duration}`, width / 2, this.yOffset);

    ctx.font = `${team_score_font_size}px Arial`;
    ctx.fillStyle = direColor;
    ctx.fillText(`${this.direScore}`, width / 2 + team_score_offset, this.yOffset);
    this.yOffset = header_height;
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

  private isKnownPlayer(name: string): boolean {
    return Boolean(this.knownPlayers.find(p => p.name === name));
  }

  //first 5 players must be radiant
  drawPlayer(ctx, player: TablePlayer, index: number, image) {

    ctx.beginPath();
    ctx.rect(this.xOffset, this.yOffset, width, line_height);
    ctx.fillStyle = this.toggleFillColor();
    ctx.fill();

    if (this.isKnownPlayer(player.name)) {
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 8;
      ctx.strokeRect(this.xOffset + player_image_width + 4, this.yOffset, width - player_image_width - 8, line_height - 2);
      ctx.fill();
    }

    ctx.font = `${player_text_font_size}px Arial`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "start";
    ctx.fillStyle = index < 5 ? radiantColor : direColor;
    ctx.drawImage(image, this.xOffset, this.yOffset, player_image_width, line_height);
    this.xOffset += player_name_xOffset;


    let playerName = "";
    let i = 0;
    while (ctx.measureText(playerName).width < player_name_width && player.name.length > i) {
      playerName += player.name[i];
      i++;
    }

    if (ctx.measureText(player.name).width > player_name_width) {
      playerName += "..";
    }

    ctx.fillText(playerName || "-", this.xOffset, this.yOffset + line_height / 2);
    this.xOffset += player_level_xOffset;

    ctx.fillText(player.level, this.xOffset, this.yOffset + line_height / 2);
    this.xOffset += player_stats_xOffset;

    ctx.fillText(`${player.kills} / ${player.deaths} / ${player.assists}`, this.xOffset, this.yOffset + line_height / 2);
    this.newLine();
  }

  newLine() {
    this.xOffset = 0;
    this.yOffset += line_height;
  }

}
