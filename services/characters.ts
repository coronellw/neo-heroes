import Character from "../models/characters";
import { ICharacter, ICalculatedCharacter, IStats, Job } from "@neo-heroes/types";
import { CharacterRepository } from "../repositories/characters";

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
        const characters = CharacterRepository.findAll();
        return characters.map((character) => ({
            name: character.name,
            job: character.job,
            status: character.isAlive() ? "alive" : "dead"
        }));
    }

    static getCharacterById(id: number): ICalculatedCharacter | undefined {
        const character = CharacterRepository.findById(id);
        return character ? character.getFormattedCharacter() : undefined;
    }

    static getCharacterInstanceById(id: number): Character | undefined {
        return CharacterRepository.findById(id);
    }

    static createCharacter(characterData: ICharacter): ICalculatedCharacter {
        this.validateCharacterName(characterData.name);
        const newCharacter = new Character(characterData);
        const savedCharacter = CharacterRepository.save(newCharacter);
        return savedCharacter.getFormattedCharacter();
    }

    static updateCharacter(id: number, characterData: { name?: string; job?: Job; attributes?: Partial<IStats> }): ICalculatedCharacter | null {
        const existingCharacter = CharacterRepository.findById(id);
        if (!existingCharacter) return null;

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
        
        // Preserve the ID when updating
        updatedCharacter.id = id;
        const success = CharacterRepository.update(id, updatedCharacter);
        
        return success ? updatedCharacter.getFormattedCharacter() : null;
    }

    static deleteCharacter(id: number): boolean {
        return CharacterRepository.delete(id);
    }
}
