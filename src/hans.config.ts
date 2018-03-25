import {Account} from "./hans.types";

export class HansConfig {
  constructor(private env = process.env){}

  //players that are monitored and mentioned in messages
  public getPlayers(): Account[] {
    // player:1234;player2:91252
    return this.get("PLAYERS").split(";")
      .map(kv => {
        const [name, account_id] = kv.split(":");
        return {name, account_id: Number(account_id)}
      })
  }

  //players that arent monitored but play often with some of the group are referred as goons, and counted
  //this helps figuring out whether they got a 5 stack going or not
  public getGoons(): Account[] {
    // player:1234;player2:91252
    return this.get("GOONS").split(";")
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

