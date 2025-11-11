import { Router } from "express";
import { CharacterController } from "../controllers/characters";

const router = Router();

router.get("/", CharacterController.getAll);
router.get("/:id", CharacterController.getById);
router.post("/", CharacterController.create);
router.put("/:id", CharacterController.update);
router.delete("/:id", CharacterController.delete);

export default router;
