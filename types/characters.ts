import { Job } from "./job";
import { IStats } from "./stats";

export interface ICharacter {
    name: string
    job: Job,
    attributes?: IStats
}

export interface ICalculatedCharacter {
    name: string;
    job: Job;
    current_health: number;
    max_health: number;
    stats: {
        strength: number;
        dexterity: number;
        intelligence: number;
    };
    battle_modifiers: {
        attack_modifier: {
            value: number;
            description?: string;
        };
        speed_modifier: {
            value: number;
            description?: string;
        };
    };
}