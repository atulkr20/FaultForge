import { Request, Response } from 'express';
import { prisma } from "../lib/prisma";
import { AttackReport } from "@faultforge/shared";

// Api/attacks

export const scheduleAttack = async (req: Request, res: Response) => {
    const { agentId, type, payload } = req.body;

    // validate required fields
    if(!agentId || !type || !payload) {
        return res.status(400).json({
            error: "agentId, type, and payload are required",
            validTypes: ["CPU_STRESS", "NETWORK_LATENCY"],
        });
    }
    // Make sure the agent actually exists before scheduling
    const agent = await prisma.agent.findUnique({ where: { id: agentId }});
    if(!agent) {
        return res.status(404).json({ error: "Agent not found"});
    }
    // One attack at a time
    if(agent.status === "BUSY") {
        return res.status(409).json({
            error: "Agent is currently busy with another attack. Wait for it to complete.",
        });
    }
    try {
        const attack = await prisma.attack.create({
            data: {
                agentId, 
                type,
                payload,
                status: "PENDING",
            },
        });
        // Mark agent busy, so no second attack gets scheduled
        await prisma.agent.update({
            where: { id: agentId },
            data: { status: "BUSY" }, 
        });
        console.log(`Attack [${type}] scheduled for agent [${agent.hostname}]`);
        return res.status(201).json(attack);

    } catch (err) {
        console.error("Schedule attack error:", err);
        return res.status(500).json({ error: "internal server error"});
    }
    
};

// Agent calls this endpoint when it finishes or fails an attack
export const reportAttack = async (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const body = req.body as AttackReport & { message?: string };

    if (!id) {
        return res.status(400).json({ error: "Attack id is required" });
    }

    try {
        const attack = await prisma.attack.findUnique({ where: { id }});
        if (!attack) {
            return res.status(404).json({ error: "Attack not found" });
        }

        const isFinished = body.status === "COMPLETED" || body.status === "FAILED";

        // Update the record with the agent's report
        const updated = await prisma.attack.update({
            where: { id },
            data: {
                status: body.status,
                completedAt: isFinished ? new Date() : undefined,
                errorMessage: body.message ?? null,
            },
        });

        // If attack is done, free the agent back to idle
        if (isFinished) {
            await prisma.agent.update({
                where: { id: attack.agentId },
                data: { status: "IDLE" },
            });
            console.log(`${body.status === "COMPLETED" ? "Yes" : "No"} Attack [${id}] ${body.status}`);
        }

        return res.json(updated);
    } catch (err) {
        console.error("Report attack error:", err);
        return res.status(500).json({ error: "internal server error" });
    }
};

export const listAttacks = async (req: Request, res: Response) => {
    try {
        const { agentId, status} = req.query;

        const attacks = await prisma.attack.findMany({
            where: {
                ...(agentId ? { agentId: String(agentId)} : {}),
                ...(status ? { status: String(status) as any}: {}),

            },
            orderBy: { scheduledAt: "desc" },
            include: {
                agent: {
                    select: { hostname: true, ipAddress: true },
                },
            },
        });
        return res.json(attacks);
    } catch(err) {
        console.error("List attacks error:", err);
        return res.status(500).json({ error: "Internal server error"});
    }
};

export const getAttack = async (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
        return res.status(400).json({ error: "Attack id is required" });
    }

    try {
        const attack = await prisma.attack.findUnique({
            where: { id },
            include: { agent: true },
        });
        if(!attack) {
            return res.status(404).json({ error: "Attack not found"});
        }
        return res.json(attack);
    } catch(err) {
        console.error("Get attack error: err");
        return res.status(500).json({ error: "Internal server error"});
    }
};
