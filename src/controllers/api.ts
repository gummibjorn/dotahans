"use strict";

import {Request, Response} from "express";
import {DotaApi} from "../dota.api";
import {ExcuseGenerator} from "../analyzers/excuse.analyzer";
import {toPromise} from "rxjs/operator/toPromise";

export let getApi = (req: Request, res: Response) => {
  res.sendStatus(200);
};


let heroList = undefined;
const getHeroList = async (dotaApi: DotaApi) => {
  if(!heroList){
    heroList = (await dotaApi.getHeroes().toPromise()).map(h => h.localized_name);
  }
  return heroList;
}

export let excuse = (dotaApi: DotaApi) => async (req: Request, res: Response) => {
  const heroes = await getHeroList(dotaApi);
  const generator = new ExcuseGenerator(heroes, heroes);
  res.send(200, generator.randomExcuse());
};
