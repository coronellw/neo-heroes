import { IAttributes } from "./attributes"

export type Modifier = {
    multipliers: {
        strength?: number
        dexterity?: number
        intelligence?: number
    }
    description?: string
}


export interface IStats extends IAttributes {
    health: number
    attack_modifier: Modifier
    speed_modifier: Modifier
}