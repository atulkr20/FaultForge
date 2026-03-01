import { Router } from "express";
import { createTarget, listTargets } from "../controllers/target.controller";

const router = Router();

router.get("/", listTargets);
router.post("/", createTarget);

export { router as targetRoutes };
