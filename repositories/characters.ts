import Character from "../models/characters";

export class CharacterRepository {
    private static characters: Character[] = [];
    private static nextId = 1;

    static findAll(): Character[] {
        return this.characters;
    }

    static findById(id: number): Character | undefined {
        return this.characters.find(c => c.id === id);
    }

    static save(character: Character): Character {
        character.id = this.nextId++;
        this.characters.push(character);
        return character;
    }
    
    static update(id: number, character: Character): boolean {
        const index = this.characters.findIndex(c => c.id === id);
        if (index === -1) return false;
        this.characters[index] = character;
        return true;
    }

    static delete(id: number): boolean {
        const initialLength = this.characters.length;
        this.characters = this.characters.filter(c => c.id !== id);
        return this.characters.length < initialLength;
    }
}