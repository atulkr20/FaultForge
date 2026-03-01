import { Request, Response } from 'express';
import { prisma } from "../prisma";
import { HeartbeatPayload } from "@faultforge/shared";

export const handleHeartbeat = async (req: Request, res: Response) => {
    const body = req.body as HeartbeatPayload;
    // If agent missing, reject immediately
    if (!body.agentId || !body.hostname) {
        return res.status(400).json({ error: "agentId and hostname are required"});
    }

    try {
        // UPSERT -> UPDATE if exists, INSERT if not
        // This is how auto-registration works

        const agent = await prisma.agent.upsert({
            where: { id: body.agentId },
            
            // If agent already exists, just referesh the info  
            update: {
                hostname: body.hostname,
                ipAddress: body.ipAddress,
                status: body.status === "BUSY" ? "BUSY" : "IDLE",
                lastSeenAt: new Date(),
                version: body.version,
            },

            // if agent is new, create a full record
            create: {
                id: body.agentId,
                hostname: body.hostname,
                ipAddress: body.ipAddress,
                platform: body.platform,
                arch: body.arch,
                version: body.version,
                status: "IDLE",
            },
        });

        // After updating the agent, check if we have a job for it
        const pendingAttack = await prisma.attack.findFirst({
            where: {
                agentId: agent.id,
                status: "PENDING",
            },
            orderBy: { scheduledAt: "asc" },
        });

        if (pendingAttack) {
            // Promote the attack from PENDING to IN PROGRESS
            await prisma.attack.update({
                where: { id: pendingAttack.id },
                data: {
                    status: "IN_PROGRESS",
                    startedAt: new Date(),

                },
            });

            console.log(
                `Sending Command[${pendingAttack.type}] to agent [${agent.hostname}]`
            );

            // Send the command back to the agent in the heartbeat response
            return res.json({
                command: {
                    commandId: pendingAttack.id,
                    type: pendingAttack.type,
                    payload: pendingAttack.payload,
                },
            });
        }

        // If no attack tell the agent to stay IDLE
        return res.json({
            command: {
                commandId: null, 
                type: "IDLE",
                payload: null,
            },
        });
    } catch (err) {
        console.error("Hearbeat error:", err);
        return res.status(500).json({ error: "Internal server error"});
    }
};
 
// GET/api/agents
export const listAgents = async (_req: Request, res: Response) => {
    try {
        const agents = await prisma.agent.findMany({
            orderBy: { lastSeenAt: "desc" },
            include: {
                // attach only the most recent attack to each agent
                attacks: {
                    orderBy: { scheduledAt: "desc" },
                    take: 1,
                },
            },
        });

        // If we haven'r heard from an agent in 30 seconds, it's considered offline
        const now = Date.now();
        const enriched = agents.map((agent) => ({
            ...agent,
            isOnline: now - new Date(agent.lastSeenAt).getTime() <30_000,
        }));
        return res.json(enriched);
    } catch (err) {
        console.error("List agents error: err");
        return res.status(500).json({ error: "Internal server error"});
    }
};

export const getAgent = async  (req: Request, res: Response) => {
    try {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;

        if (!id) {
            return res.status(400).json({ error: "Agent id is required" });
        }

        const agent = await prisma.agent.findUnique({
            where: { id },
            include: {
                attacks: { orderBy: { scheduledAt: "desc"}},
            },
        });

        if(!agent) {
            return res.status(404).json({ error: "Agent not found"});
        } 
        return res.json(agent);
    } catch (err) {
        console.error("Get agent error:", err);
        return res.status(500).json({ error: "Internal Server error"});
    }
};
