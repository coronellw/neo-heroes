import { Request, Response } from "express";
import { CharacterService } from "../services/characters";
import { ICharacter } from "../types";

export class CharacterController {
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const characters = CharacterService.getAllCharacters();
            res.status(200).json(characters);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve characters" });
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const character = CharacterService.getCharacterById(id);
            
            if (!character) {
                res.status(404).json({ error: "Character not found" });
                return;
            }
            
            res.status(200).json(character);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve character" });
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        try {
            const characterData: ICharacter = req.body;
            
            if (!characterData.name || !characterData.job) {
                res.status(400).json({ error: "Name and job are required" });
                return;
            }
            
            const newCharacter = CharacterService.createCharacter(characterData);
            res.status(201).json(newCharacter);
        } catch (error) {
            if (error instanceof Error && error.message.includes("can only contain")) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Failed to create character" });
            }
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const characterData: Partial<ICharacter> = req.body;
            
            const updatedCharacter = CharacterService.updateCharacter(id, characterData);
            
            if (!updatedCharacter) {
                res.status(404).json({ error: "Character not found" });
                return;
            }
            
            res.status(200).json(updatedCharacter);
        } catch (error) {
            if (error instanceof Error && error.message.includes("can only contain")) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Failed to update character" });
            }
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = CharacterService.deleteCharacter(id);
            
            if (!deleted) {
                res.status(404).json({ error: "Character not found" });
                return;
            }
            
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Failed to delete character" });
        }
    }
}
