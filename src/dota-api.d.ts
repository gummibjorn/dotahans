export interface AbilityUpgrade {
    ability: number;
    time: number;
    level: number;
}

export interface Player {
    account_id: number;
    player_slot: number;
    hero_id: number;
    item_0: number;
    item_1: number;
    item_2: number;
    item_3: number;
    item_4: number;
    item_5: number;
    backpack_0: number;
    backpack_1: number;
    backpack_2: number;
    kills: number;
    deaths: number;
    assists: number;
    leaver_status: number;
    last_hits: number;
    denies: number;
    gold_per_min: number;
    xp_per_min: number;
    level: number;
    hero_damage: number;
    tower_damage: number;
    hero_healing: number;
    gold: number;
    gold_spent: number;
    scaled_hero_damage: number;
    scaled_tower_damage: number;
    scaled_hero_healing: number;
    ability_upgrades: AbilityUpgrade[];
}

export interface DotaApiMatchResult {
    players: Player[];
    radiant_win: boolean;
    duration: number;
    pre_game_duration: number;
    start_time: number;
    match_id: number;
    match_seq_num: number;
    tower_status_radiant: number;
    tower_status_dire: number;
    barracks_status_radiant: number;
    barracks_status_dire: number;
    cluster: number;
    first_blood_time: number;
    lobby_type: number;
    human_players: number;
    leagueid: number;
    positive_votes: number;
    negative_votes: number;
    game_mode: number;
    flags: number;
    engine: number;
    radiant_score: number;
    dire_score: number;
}

export interface DotaApiMatchResultRoot {
    result: DotaApiMatchResult;
}



//match history
export interface Player {
    account_id: any;
    player_slot: number;
    hero_id: number;
}

export interface Match {
    match_id: any;
    match_seq_num: any;
    start_time: number;
    lobby_type: number;
    radiant_team_id: number;
    dire_team_id: number;
    players: Player[];
}

export interface DotaApiMatch {
    status: number;
    num_results: number;
    total_results: number;
    results_remaining: number;
    matches: Match[];
}

export interface DotaApiMatchRoot {
    result: DotaApiMatch;
}

