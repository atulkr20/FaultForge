import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const app = express();
const PORT = 3000;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(express.json());

// Register a new agent
app.post('/agents/register', async (req: Request, res: Response) => {
  const { hostname, ipAddress } = req.body;

  try {
    const agent = await prisma.agent.upsert({
      where: { hostname },
      update: { ipAddress, status: 'IDLE', lastSeen: new Date() },
      create: { hostname, ipAddress, status: 'IDLE' },
    });
    res.status(200).json({ message: 'Agent registered', agentId: agent.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register agent' });
  }
});

// The bridge

app.get('/agents/:hostname/work', async (req, res) => {
    const { hostname } = req.params;

    // Find the most recent incomplete attack for this agent 
    const pendingAttack = await prisma.attackLog.findFirst({
        where: {
            agent:{ hostname },
            completedAt: null,
        }
    });

    if (pendingAttack) {
        return res.json({ instruction: "ATTACK", ...pendingAttack });
    }
    res.json({ instruction: "SLEEP" });
});

// Trigger an attack
app.post('/attack/:agentId', async (req: Request<{ agentId: string }>, res: Response) => {
  const { agentId } = req.params;
  const { faultType, parameters } = req.body;

  try {
    // Check if agent exists and is IDLE
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent || agent.status !== 'IDLE') {
      return res.status(400).json({ error: 'Agent not found or busy' });
    }

    // Create a log entry for this attack
    const attack = await prisma.attackLog.create({
      data: {
        agentId,
        faultType,
        parameters,
      },
    });

    // Update agent status
    await prisma.agent.update({
      where: { id: agentId },
      data: { status: 'ATTACKING' },
    });

    // TODO: send a socket/http signal to the agent here
    res.status(200).json({ message: 'Attack initiated', attackId: attack.id });
  } catch (error) {
    res.status(500).json({ error: 'Attack failed to launch' });
  }
});

app.listen(PORT, () => {
  console.log(`Control plane running at http://localhost:${PORT}`);
});
