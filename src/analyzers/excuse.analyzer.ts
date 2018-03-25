import {AnalysisFormat, AnalysisType, Analyzer} from "../hans.types";
import {DotaApiMatchResult, Player} from "../dota-api";
import {Analysis} from "../analysis";
import Excuse = AnalysisFormat.Excuse;
import {heroes as heroList} from '../data/heroes';
import WhoWon = AnalysisFormat.WhoWon;

function both(s){
  return [`our ${s}`, `their ${s}`];
}

const prep = [
  "We lost because",
  "We only lost because",
  "They won because",
  "They only won because",
]

const subject = [
  //mechanics
  "Roshan",
  ...both("Courier"),
  ...both("Ancient"),
  ...both("Base"),
  ...both("team"),
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
  "a bounty rune",
  "a set of brown boots",
  //people
  "%HERO%",
  "%PLAYER%",
  "%PLAYER%'s mum",
  "%PLAYER%'s PC",
  "%PLAYER%'s mouse",
  "%PLAYER%'s keyboard",
  "%PLAYER%'s chair",
  "%PLAYER%'s monitor",
  "%PLAYER%'s brain",
  "%PLAYER%'s Twitter followers",
  "valve",
  "volvo",
  "Gaben",
  "Icefrog",
  "the russians",
  "Dota Plus",
  "all chat",
  "Twitch chat",
];

const cause = [
  //generic flames
  "fed %SUBJECT%",
  "reported %SUBJECT%",
  "was garbage",
  "is overpowered",
  "is underpowered",
  "was AFK",
  "was jungling",
  "was roaming",
  "was harassing %SUBJECT%",
  "was harassed by %SUBJECT%",
  "had a free lane",
  "had a hard lane",
  "trilaned",
  "bought back",
  "didn't buy back",
  "had a rapier",
  "fought %SUBJECT% 1v1",
  "used smokes",
  "used dust",
  "bought obsever wards",
  "bought sentries",
  "didn't buy any wards",
  "got fountain dived",
  "fountain dived",
  "got stream sniped",
  "was using map hacks",
  "didn't read the patch notes",
  "had Aghanim's",
  //marios
  "had high ping",
  "dropped frames",
  "had packet loss",
  "forgot to turn off the lights",
  //franks
  '"found" %SUBJECT',
  "solo pushed %SUBJECT",
  //danis
  "fed Drow",
];


function randomElement(items: string[]){
  return items[Math.floor(Math.random()*items.length)];
}

function getHeroName(heroId: number){
  const hero = heroList.find((hero)=> hero.id === heroId)
  if(hero){
    return hero.localized_name;
  } else {
    return `[[Hero ${heroId}]]`
  }
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
    return `${this.pickRandom(prep)} ${this.pickRandom(subject)} ${this.pickRandom(cause)}.`;
  }
}
