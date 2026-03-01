import { Router } from "express";
import {
    handleHeart,
    listAgents,
    getAgent,
} from "../controllers/agent.controller";

const router = Router();

router.post("/heartbeat", handleHeartbeat);

router.get("/", listAgents);
router.get("/:id", getAgent);

export { router as agentRoutes};