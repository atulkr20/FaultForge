import express, { Request, Response } from 'express';
import { PrismaClient} from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());

// Register a new agent
app.post('/agents/register', async (req: Request, res: Response) => {
    const { hostname, ipaddress } = req.body;

    try {
        const agent = await prisma.agent.upsert({
            where: { hostname }, 
            update: { ipAddress, status: 'IDLE', lastSeen: new Date() },
            create: { hostname, ipAddress, status: 'IDLE' },
        });
        res.status(200).json({ message: "Agent registered", agentId: agent.id });
    } catch(error) {
        res.status(500).json({ error: "Failed to register agent"});
    }
});

/// Trigger an Attack
app.post('/attack/:agentId', async (req: Request, res: Response) => {
    const { agentId } = req.params;
    const { faultType, parameters } = req.body;

    try {
        // Check if agent exists and is IDLE
        const agent = await prisma.agent.findUnique({ where: { id: agentId }});
        if(!agent || agent.status !== 'IDLE' ) {
            return res.status(400).json({ error: "Agent not found or busy"});
        } 

        // Create a log entry for this attack
        const attack = await prisma.attackLog.create({
            data: {
                agentId,
                faultType, 
                parameters,

            }
        });

        // update agent status
        await prisma.agent.update({
            where: { id: agentId },
            data: { status: 'ATTACKING' }
        });

        // TODO we will send a socket / http signal to the Agent here
        res.status(200).json({ message: "Attack initiated", attackId: attack.id});
    } catch (error) {
        res.status(500).json({ error: "Attack failed to launch"});
    }
});

app.listen(PORT, () => {
    console.log(`Control plane running at http://localhost:${PORT}`);
});