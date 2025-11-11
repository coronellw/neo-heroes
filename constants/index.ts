import { Job } from "../types";
import { IStats } from "../types";

export const BASE_STATS: Record<Job, Omit<IStats, "health">> = {
    [Job.Mage]: {
        hp: 12,
        strength: 5,
        dexterity: 6,
        intelligence: 10,
        attack_modifier: {
            multipliers: {
                strength: 0.2,
                dexterity: 0.2,
                intelligence: 1.2
            },
            description: "20% of strength + 20% of dexterity + 120% of intelligence"
        },
        speed_modifier: {
            multipliers: {
                dexterity: 0.4,
                strength: 0.1 
            },
            description: "40% of dexterity + 10% of strength"
        }
    },
    [Job.Thief]: {
        hp: 15,
        strength: 4,
        dexterity: 10,
        intelligence: 4,
        attack_modifier: {
            multipliers: {
                strength: 0.25,
                dexterity: 1,
                intelligence: 0.25
            },
            description: "25% of strength + 100% of dexterity + 25% of intelligence"
        },
        speed_modifier: {
            multipliers: {
                dexterity: 0.8
            },
            description: "80% of dexterity"
        }
    },
    [Job.Warrior]: {
        hp: 20,
        strength: 10,
        dexterity: 5,
        intelligence: 5,
        attack_modifier: {
            multipliers: {
                strength: 0.8,
                dexterity: 0.2,
            },
            description: "80% of strength + 20% of dexterity"
        },
        speed_modifier: {
            multipliers: {
                dexterity: 0.6,
                intelligence: 0.2
            },
            description: "60% of dexterity + 20% of intelligence"
        }
    },
}