import { Job } from "../types/job"
import { ICalculatedCharacter, ICharacter, IStats } from "../types"
import { BASE_STATS } from "../constants";


class Character implements ICharacter {
    id?: number;
    name: string;
    job: Job;
    attributes: IStats;

    constructor(character: ICharacter) {
        this.name = character.name;
        this.job = character.job;
        // BASE_STAT omits health by design, so any new character will start with the max health equals to the BASE_STAT of its job
        // health will decrease with time while HP will be the maximum health points a character can have
        // for new characters hp === health, but the hp may increase based on the character level when implemented
        this.attributes = character.attributes ?? { ...BASE_STATS[this.job], health: BASE_STATS[this.job].hp };

    }

    getAttackModifier() {
        let attackModifier = 0;
        if (this.attributes.attack_modifier.multipliers.strength) {
            attackModifier += this.attributes.strength * this.attributes.attack_modifier.multipliers.strength;
        }
        if (this.attributes.attack_modifier.multipliers.dexterity) {
            attackModifier += this.attributes.dexterity * this.attributes.attack_modifier.multipliers.dexterity;
        }
        if (this.attributes.attack_modifier.multipliers.intelligence) {
            attackModifier += this.attributes.intelligence * this.attributes.attack_modifier.multipliers.intelligence;
        }

        return attackModifier;
    }

    getSpeedModifier() {
        let speedModifier = 0;
        if (this.attributes.speed_modifier.multipliers.strength) {
            speedModifier += this.attributes.strength * this.attributes.speed_modifier.multipliers.strength;
        }
        if (this.attributes.speed_modifier.multipliers.dexterity) {
            speedModifier += this.attributes.dexterity * this.attributes.speed_modifier.multipliers.dexterity;
        }
        if (this.attributes.speed_modifier.multipliers.intelligence) {
            speedModifier += this.attributes.intelligence * this.attributes.speed_modifier.multipliers.intelligence;
        }
        return speedModifier;
    }

    isAlive(): boolean {
        return this.attributes.health > 0;
    }

    takeDamage(amount: number): void {
        this.attributes.health = Math.max(0, this.attributes.health - amount);
    }

    canBattle(): boolean {
        return this.isAlive() && this.attributes !== undefined;
    }

    getFormattedCharacter(): ICalculatedCharacter {
        return {
            id: this.id,
            name: this.name,
            job: this.job,
            current_health: this.attributes.health,
            max_health: this.attributes.hp,
            stats: {
                strength: this.attributes.strength,
                dexterity: this.attributes.dexterity,
                intelligence: this.attributes.intelligence,
            },
            battle_modifiers: {
                attack_modifier: {
                    value: this.getAttackModifier(),
                    description: this.attributes.attack_modifier.description
                },
                speed_modifier: {
                    value: this.getSpeedModifier(),
                    description: this.attributes.speed_modifier.description
                }
            }
        }
    }
}

export default Character;