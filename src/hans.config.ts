export class HansConfig {
  static players: Array<Account> = [{name: "Mario", account_id: 56706937}];

  static getPlayerNameById(account_id: number): string{
    const player = this.players.find(p => p.account_id === account_id);
    return player.name ? player.name : "Känni nöd";
  }
}

export type Account = { name: string, account_id: number };
