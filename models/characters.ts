import { Job } from "../types/job"
import { ICharacter, IStats } from "../types"
import { BASE_STATS } from "../constants";


class Character implements ICharacter {
    name: string;
    job: Job;
    attributes: IStats;

    constructor(character: ICharacter) {
        this.name = character.name;
        this.job = character.job;
        // BASE_STAT omits health by design, so any new character will start with the max health equals to the BASE_STAT of its job
        // health will decrease with time while HP will be the maximum health points a character can have
        // for new characters hp === health, but the hp may increase based on the character level when implemented
        this.attributes = { ...BASE_STATS[this.job], health: BASE_STATS[this.job].hp };
        
    }
}

export default Character;