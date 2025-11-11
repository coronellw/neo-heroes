import Character from "../models/characters";
import { ICharacter } from "../types";

let characters: Character[] = [];
let nextId = 1;

export class CharacterService {
    private static validateCharacterName(name: string): void {
        const errors: string[] = [];
        
        if (name.length < 4 || name.length > 15) {
            errors.push("Character name must be between 4 and 15 characters");
        }
        
        const nameRegex = /^[a-zA-Z_]+$/;
        if (!nameRegex.test(name)) {
            errors.push("Character name can only contain letters and underscores");
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join("; "));
        }
    }

    private static calculateModifiers(character: Character): any {
        const attributes = character.attributes;
        if (!attributes) return character;

        const calculatedAttackModifier = {
            value: 0,
            description: attributes.attack_modifier.description
        };
        
        const calculatedSpeedModifier = {
            value: 0,
            description: attributes.speed_modifier.description
        };

        // Calculate attack modifier
        if (attributes.attack_modifier.multipliers.strength) {
            calculatedAttackModifier.value += attributes.strength * attributes.attack_modifier.multipliers.strength;
        }
        if (attributes.attack_modifier.multipliers.dexterity) {
            calculatedAttackModifier.value += attributes.dexterity * attributes.attack_modifier.multipliers.dexterity;
        }
        if (attributes.attack_modifier.multipliers.intelligence) {
            calculatedAttackModifier.value += attributes.intelligence * attributes.attack_modifier.multipliers.intelligence;
        }

        // Calculate speed modifier
        if (attributes.speed_modifier.multipliers.strength) {
            calculatedSpeedModifier.value += attributes.strength * attributes.speed_modifier.multipliers.strength;
        }
        if (attributes.speed_modifier.multipliers.dexterity) {
            calculatedSpeedModifier.value += attributes.dexterity * attributes.speed_modifier.multipliers.dexterity;
        }
        if (attributes.speed_modifier.multipliers.intelligence) {
            calculatedSpeedModifier.value += attributes.intelligence * attributes.speed_modifier.multipliers.intelligence;
        }

        return {
            name: character.name,
            job: character.job,
            current_health: attributes.health,
            max_health: attributes.hp,
            stats: {
                strength: attributes.strength,
                dexterity: attributes.dexterity,
                intelligence: attributes.intelligence,
            },
            battle_modifiers: {
                attack_modifier: calculatedAttackModifier,
                speed_modifier: calculatedSpeedModifier
            }
        };
    }

    static getAllCharacters(): Array<{ name: string; job: string; status: "alive" | "dead" }> {
        return characters.map((character) => ({
            name: character.name,
            job: character.job,
            status: character.attributes?.health === 0 ? "dead" : "alive"
        }));
    }

    static getCharacterById(id: number): any {
        const character = characters.find(char => (char as any).id === id);
        if (!character) return undefined;
        return this.calculateModifiers(character);
    }

    static createCharacter(characterData: ICharacter): any {
        this.validateCharacterName(characterData.name);
        const newCharacter = new Character(characterData);
        (newCharacter as any).id = nextId++;
        characters.push(newCharacter);
        return this.calculateModifiers(newCharacter);
    }

    static updateCharacter(id: number, characterData: Partial<ICharacter>): any {
        const index = characters.findIndex(char => (char as any).id === id);
        if (index === -1) return null;

        const existingCharacter = characters[index];
        const newName = characterData.name ?? existingCharacter.name;
        
        if (characterData.name) {
            this.validateCharacterName(characterData.name);
        }
        
        const updatedCharacter = new Character({
            name: newName,
            job: characterData.job ?? existingCharacter.job,
            attributes: characterData.attributes ?? existingCharacter.attributes
        });
        (updatedCharacter as any).id = id;
        characters[index] = updatedCharacter;
        return this.calculateModifiers(updatedCharacter);
    }

    static deleteCharacter(id: number): boolean {
        const initialLength = characters.length;
        characters = characters.filter(char => (char as any).id !== id);
        return characters.length < initialLength;
    }
}
