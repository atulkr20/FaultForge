import { Router } from 'express';
import {
    scheduleAttack,
    reportAttack,
    listAttacks,
    getAttack,
} from "../controllers/attack.controller";

const router = Router();

router.post("/", scheduleAttack);

router.patch('/:id/report', reportAttack);

router.get("/", listAttacks);

router.get("/:id", getAttack);

export { router as attackRoutes };
