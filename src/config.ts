export class Config {
  static players: Array<Account> = [{name: "Mario", account_id: 56706937}];
}

export type Account = { name: string, account_id: number };
