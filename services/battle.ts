import { ICalculatedCharacter } from "../types";
import { CharacterService } from "./characters";

export class BattleService {
    static startBattle(characterId1: number, characterId2: number): string {
        let damage = 0
        const p1 = CharacterService.getCharacterById(characterId1);
        const p2 = CharacterService.getCharacterById(characterId2);

        if (!p1) {
            throw new Error(`Character with ID ${characterId1} not found`);
        }

        if (!p2) {
            throw new Error(`Character with ID ${characterId2} not found`);
        }

        if (p1.current_health === 0) {
            throw new Error(`${p1.name} is already dead and cannot battle`);
        }

        if (p2.current_health === 0) {
            throw new Error(`${p2.name} is already dead and cannot battle`);
        }

        let log = `Battle between ${p1.name} (${p1.job}) - ${p1.current_health} HP and ${p2.name} (${p2.job}) - ${p2.current_health} HP begins!\n`;

        let p1Health = p1.current_health;
        let p2Health = p2.current_health;

        while (p1Health > 0 && p2Health > 0) {
            let speed1 = Math.random() * p1.battle_modifiers.speed_modifier.value;
            let speed2 = Math.random() * p2.battle_modifiers.speed_modifier.value;

            while (speed1 === speed2) {
                speed1 = Math.random() * p1.battle_modifiers.speed_modifier.value;
                speed2 = Math.random() * p2.battle_modifiers.speed_modifier.value;
            }

            let [attacker, defender, attackerHealth, defenderHealth] = speed1 > speed2
                ? [p1, p2, p1Health, p2Health]
                : [p2, p1, p2Health, p1Health];

            log += `\n${attacker.name} ${speed1 > speed2 ? speed1.toFixed(2) : speed2.toFixed(2)} speed was faster than ${defender.name} ${speed1 > speed2 ? speed2.toFixed(2) : speed1.toFixed(2)} speed and will attack first.\n`;

            damage = Math.random() * attacker.battle_modifiers.attack_modifier.value;

            if (speed1 > speed2) {
                p2Health -= damage;
                defenderHealth = p2Health;
            } else {
                p1Health -= damage;
                defenderHealth = p1Health;
            }

            log += `${attacker.name} attacks ${defender.name} for ${damage.toFixed(2)}. ${defender.name} has ${Math.max(0, defenderHealth).toFixed(2)} HP remaining.\n`;

            // if defender survives it will attack
            if (defenderHealth > 0) {
                damage = Math.random() * defender.battle_modifiers.attack_modifier.value;

                if (speed1 > speed2) {
                    p1Health -= damage;
                    attackerHealth = p2Health;
                } else {
                    p2Health -= damage;
                    attackerHealth = p1Health;
                }
                log += `${defender.name} attacks ${attacker.name} for ${damage.toFixed(2)}. ${attacker.name} has ${Math.max(0, attackerHealth).toFixed(2)} HP remaining.\n`;
            }
        }


        // Battle simulation logic can be added here
        const winner = p1Health > 0 ? p1 : p2;

        CharacterService.updateCharacter(characterId1, { 
            attributes: { 
                health: Math.max(0, p1Health) 
            } 
        });
        CharacterService.updateCharacter(characterId2, { 
            attributes: { 
                health: Math.max(0, p2Health) 
            } 
        });


        log += `${winner.name} wins the battle! ${winner.name} still has ${p1Health > 0 ? p1Health.toFixed(2) : p2Health.toFixed(2)} HP remaining!`

        return log
    }
}
