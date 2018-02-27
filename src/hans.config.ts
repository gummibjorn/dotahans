import {Account} from "./hans.types";

export class HansConfig {
  constructor(private env = process.env){}

  public getPlayers(): Account[] {
    // player:1234;player2:91252
    return this.get("PLAYERS").split(";")
      .map(kv => {
        const [name, account_id] = kv.split(":");
        return {name, account_id: Number(account_id)}
      })
  }

  public get(key, defaultValue = undefined): string {
    const val = this.env[key]
    if(defaultValue === undefined && !val){
      console.warn(`Tried to access empty config '${key}'`);
      defaultValue = "";
    }
    return val || defaultValue;
  }


  getPlayerNameById(account_id: number): string{
    const player = this.getPlayers().find(p => p.account_id === account_id);
    return player.name ? player.name : "Känni nöd";
  }
}

