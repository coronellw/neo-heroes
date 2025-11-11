import Character from "../models/characters";

export class CharacterRepository {
    private static characters: Character[] = [];
    private static nextId = 1;

    static findAll(): Character[] {
        return this.characters;
    }

    static findById(id: number): Character | undefined {
        return this.characters.find(c => (c as any).id === id);
    }

    static save(character: Character): Character {
        (character as any).id = this.nextId++;
        this.characters.push(character);
        return character;
    }
    
    static update(id: number, character: Character): boolean {
        const index = this.characters.findIndex(c => (c as any).id === id);
        if (index === -1) return false;
        this.characters[index] = character;
        return true;
    }

    static delete(id: number): boolean {
        const initialLength = this.characters.length;
        this.characters = this.characters.filter(c => (c as any).id !== id);
        return this.characters.length < initialLength;
    }
}