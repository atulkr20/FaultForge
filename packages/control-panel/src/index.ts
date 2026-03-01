import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { agentRoutes } from "./routes/agent.routes";
import { attackRoutes } from "./routes/attack.routes";

dotenv.config();

const app = express();
const PORT  = process.env.PORT || 3000;

// Middleware
app.use(cors());

app.use(express.json());

//Routes
app.use("./api/agents", agentRoutes);
app.use("/api/atacks", attackRoutes);

// Health check to monintor the server is alive
app.get("/health", (_, res) => {
    res.json({
        status: "ok",
        service: "faultforge-control-panel",
        timestamp: new Date().toISOString(),
    });
});

// Start Server

app.listen(PORT, () => {
    console.log(`Faultforge control panel is runign on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}`);
});