import Character from "../models/characters";
import { CharacterService } from "./characters";

export class BattleService {
    static startBattle(characterId1: number, characterId2: number): string {
        // Get Character instances directly
        const p1 = CharacterService.getCharacterInstanceById(characterId1);
        const p2 = CharacterService.getCharacterInstanceById(characterId2);

        if (!p1) {
            throw new Error(`Character with ID ${characterId1} not found`);
        }

        if (!p2) {
            throw new Error(`Character with ID ${characterId2} not found`);
        }

        // Use canBattle() method to check battle readiness
        if (!p1.canBattle()) {
            throw new Error(`${p1.name} is already dead and cannot battle`);
        }

        if (!p2.canBattle()) {
            throw new Error(`${p2.name} is already dead and cannot battle`);
        }

        let log = `Battle between ${p1.name} (${p1.job}) - ${p1.attributes.health.toFixed(2)} HP and ${p2.name} (${p2.job}) - ${p2.attributes.health} HP begins!\n`;

        // Battle loop continues while both are alive
        while (p1.isAlive() && p2.isAlive()) {
            let speed1 = Math.random() * p1.getSpeedModifier();
            let speed2 = Math.random() * p2.getSpeedModifier();

            // Ensure different speeds
            while (speed1 === speed2) {
                speed1 = Math.random() * p1.getSpeedModifier();
                speed2 = Math.random() * p2.getSpeedModifier();
            }

            let [attacker, attackerSpeed, defender, defenderSpeed] = speed1 > speed2 ? [p1, speed1, p2, speed2] : [p2, speed2, p1, speed1];

            log += `\n${attacker.name} ${attackerSpeed.toFixed(2)} speed was faster than ${defender.name} ${defenderSpeed.toFixed(2)} speed and will attack first.\n`;

            const damage = Math.random() * attacker.getAttackModifier();

            defender.takeDamage(damage);

            log += `${attacker.name} attacks ${defender.name} for ${damage.toFixed(2)}. ${defender.name} has ${defender.attributes.health.toFixed(2)} HP remaining.\n`;

            // Counter-attack if defender is still alive
            if (defender.isAlive()) {
                const counterDamage = Math.random() * defender.getAttackModifier();
                attacker.takeDamage(counterDamage);
                log += `${defender.name} attacks ${attacker.name} for ${counterDamage.toFixed(2)}. ${attacker.name} has ${attacker.attributes.health.toFixed(2)} HP remaining.\n`;
            }
        }

        const winner = p1.isAlive() ? p1 : p2;
        const winnerHealth = winner.attributes.health;

        // Update character health in database
        CharacterService.updateCharacter(characterId1, { 
            attributes: { 
                health: p1.attributes.health
            } 
        });
        CharacterService.updateCharacter(characterId2, { 
            attributes: { 
                health: p2.attributes.health
            } 
        });

        log += `${winner.name} wins the battle! ${winner.name} still has ${winnerHealth.toFixed(2)} HP remaining!`;

        return log;
    }
}
