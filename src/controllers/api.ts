"use strict";

import { Response, Request } from "express";

export let getApi = (req: Request, res: Response) => {
  res.sendStatus(200);
};
