import Character from "../models/characters";
import { ICharacter, ICalculatedCharacter } from "../types";
import { IStats } from "../types/stats";
import { Job } from "../types/job";

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

    static getAllCharacters(): Array<{ name: string; job: string; status: "alive" | "dead" }> {
        return characters.map((character) => ({
            name: character.name,
            job: character.job,
            status: character.attributes?.health === 0 ? "dead" : "alive"
        }));
    }

    static getCharacterById(id: number): ICalculatedCharacter | undefined {
        const character = characters.find(c => (c as any).id === id);
        return character ? character.getFormattedCharacter() : undefined;
    }

    static getCharacterInstanceById(id: number): Character | undefined {
        return characters.find(c => (c as any).id === id);
    }

    static createCharacter(characterData: ICharacter): ICalculatedCharacter {
        this.validateCharacterName(characterData.name);
        const newCharacter = new Character(characterData);
        (newCharacter as any).id = nextId++;
        characters.push(newCharacter);
        return newCharacter.getFormattedCharacter();
    }

    static updateCharacter(id: number, characterData: { name?: string; job?: Job; attributes?: Partial<IStats> }): ICalculatedCharacter | null {
        const index = characters.findIndex(char => (char as any).id === id);
        if (index === -1) return null;

        const existingCharacter = characters[index];
        const newName = characterData.name ?? existingCharacter.name;
        
        if (characterData.name) {
            this.validateCharacterName(characterData.name);
        }
        
        // Merge attributes if partial update is provided
        let mergedAttributes = existingCharacter.attributes;
        if (characterData.attributes && existingCharacter.attributes) {
            mergedAttributes = {
                ...existingCharacter.attributes,
                ...characterData.attributes
            } as IStats;
        }
        
        const updatedCharacter = new Character({
            name: newName,
            job: characterData.job ?? existingCharacter.job,
            attributes: mergedAttributes
        });
        (updatedCharacter as any).id = id;
        characters[index] = updatedCharacter;
        return updatedCharacter.getFormattedCharacter();
    }

    static deleteCharacter(id: number): boolean {
        const initialLength = characters.length;
        characters = characters.filter(char => (char as any).id !== id);
        return characters.length < initialLength;
    }
}
