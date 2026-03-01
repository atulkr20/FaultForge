import { Router } from 'express';
import {
    scheduleAttack,
    reportAttack,
    listAttacks,
    getAttack,
    cancelAttack,
} from "../controllers/attack.controller";

const router = Router();

router.post("/", scheduleAttack);

router.patch('/:id/report', reportAttack);

router.post('/:id/cancel', cancelAttack);

router.get("/", listAttacks);

router.get("/:id", getAttack);

export { router as attackRoutes };
