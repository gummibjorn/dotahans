"use strict";

import { Response, Request } from "express";
import {heroes as heroList} from '../data/heroes';
import {ExcuseGenerator} from "../analyzers/excuse.analyzer";

export let getApi = (req: Request, res: Response) => {
  res.sendStatus(200);
};

const heroes = heroList.map(h => h.localized_name);
const generator = new ExcuseGenerator(heroes, heroes);

export let excuse = (req: Request, res: Response) => {
  res.send(200, generator.randomExcuse());
};
