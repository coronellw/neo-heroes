import { Request, Response } from "express";
import { BattleService } from "../services/battle";

export class BattleController {
    static async startBattle(req: Request, res: Response): Promise<void> {
        try {
            const { characterId1, characterId2 } = req.body;

            // Validate input
            if (!characterId1 || !characterId2) {
                res.status(400).json({ error: "Both characterId1 and characterId2 are required" });
                return;
            }

            if (typeof characterId1 !== "number" || typeof characterId2 !== "number") {
                res.status(400).json({ error: "Character IDs must be numbers" });
                return;
            }

            if (characterId1 === characterId2) {
                res.status(400).json({ error: "A character cannot battle itself" });
                return;
            }

            const battleResult = BattleService.startBattle(characterId1, characterId2);
            res.status(200).json(battleResult);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("not found") || error.message.includes("already dead") || error.message.includes("must have attributes")) {
                    res.status(400).json({ error: error.message });
                } else {
                    res.status(500).json({ error: "Failed to start battle" });
                }
            } else {
                res.status(500).json({ error: "Failed to start battle" });
            }
        }
    }
}
