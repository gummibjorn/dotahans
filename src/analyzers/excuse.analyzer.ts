import {AnalysisFormat, AnalysisType, Analyzer} from "../hans.types";
import {DotaApiMatchResult, Player} from "../dota-api";
import {Analysis} from "../analysis";
import Excuse = AnalysisFormat.Excuse;
import {heroes as heroList} from '../data/heroes';
import WhoWon = AnalysisFormat.WhoWon;

function all(s){
  return [`our ${s}`, `their ${s}`];
}
const subject = [
  "Roshan",
  ...all("Courier"),
  ...all("Ancient"),
  ...all("Base"),
  "the secret shop",
  "the side shop",
  "the shop keeper",
  "the river",
  "top lane",
  "mid lane",
  "bottom lane",
  "the jungle",
  "our mid T1",
  "their top T3",
  "%HERO%",
  "%PLAYER%",
  "%PLAYER%'s mum",
  "%PLAYER%'s PC",
  "%PLAYER%'s mouse",
  "%PLAYER%'s keyboard",
  "a bounty rune",
];

const cause = [
  //generic flames
  "fed Drow",
  "fed %SUBJECT%",
  "was garbage",
  "is overpowered",
  "is underpowered",
  "was AFK",
  "was jungling",
  "was harassing %SUBJECT%",
  "was harassed by %SUBJECT%",
  "had a free lane",
  "had a hard lane",
  "trilaned",
  "bought back",
  "didn't buy back",
  "had a rapier",
  //marios
  "had high ping",
  "dropped frames",
  "forgot to turn off the lights",
];


function randomElement(items: string[]){
  return items[Math.floor(Math.random()*items.length)];
}

function getHeroName(heroId: number){
  return heroList.find((hero)=> hero.id === heroId).localized_name;
}


export class ExcuseGeneratorAnalyzer implements Analyzer {
  analysisType = AnalysisType.EXCUSE;


  analyze(matchInfo: DotaApiMatchResult, analysis: Analysis): Excuse {
    const whowon = analysis.get(AnalysisType.WHOWON) as WhoWon;
    const heroes = matchInfo.players.map(p => getHeroName(p.hero_id));
    const generator = new ExcuseGenerator(heroes, whowon.players);
    return {excuse: whowon.won ? "" : generator.randomExcuse()};
  }

}

export class ExcuseGenerator{
  constructor(private heroes: string[], private players: string[]){};

  pickRandom(items: string[]){
    const value = randomElement(items);
    return this.replace(value);
  }

  replace(s: string){
    const match = s.match(/%(\w+)%/);
    if(match === null){
      return s;
    } else {
      const replacement = this.resolve(match[1] as any);
      return s.replace(`%${match[1]}%`, replacement);
    }
  }

  resolve(type: "HERO" | "PLAYER" | "SUBJECT"){
    switch(type){
      case "HERO":
        return this.pickRandom(this.heroes);
      case "PLAYER":
        return this.pickRandom(this.players);
      case "SUBJECT":
        return this.replace(this.pickRandom(subject));
    }
  }

  randomExcuse() : string {
    return `We only lost because ${this.pickRandom(subject)} ${this.pickRandom(cause)}.`;
  }
}
