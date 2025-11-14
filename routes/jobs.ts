import { Router } from "express";
import { JobsController } from "../controllers/jobs";

const router = Router();

router.get("/", JobsController.getAll);

export default router;