import { Router } from "express";
import { BattleController } from "../controllers/battle";

const router = Router();

// POST /api/battle - Start a battle between two characters
router.post("/", BattleController.startBattle);

export default router;
