import dotenv from 'dotenv';
import os from 'os';
import { getOrCreateAgentId } from './identity';
import { startPolling } from './poller';

dotenv.config();

//Build Agent Identity
// We collect system info once at startup
// os.networkInterface() gives all network cards - we find the first


const getLocalIp = (): string => {
    const interfaces = Object.values(os.networkInterfaces()).flat();
    const realInterface = interfaces.find(
        (i) => i?.family === "IPv4" && !i.internal
    );
    return realInterface?.address || "127.0.0.1";
};

export const agentMeta = {
    agentId: getOrCreateAgentId(),
    hostname: os.hostname(),
    ipAddress: getLocalIp(),
    platform: os.platform(), // "linux", "win32"
    arch: os.arch(),         // "x64", "arm64"
    version: process.env.AGENT_VERSION || "0.1.0",

};

// Start
console.log("\n faultForge Chaos Agent");
console.log(`ID :   ${agentMeta.agentId}`);
console.log(`Hostname : ${agentMeta.hostname}`);
console.log(` IP : ${ agentMeta.ipAddress}`);
console.log(` Platform : ${agentMeta.platform}`);
console.log(` Panel : ${ process.env.CONTROL_PANEL_URL}`);

const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL_MS  || "5000");
startPolling(agentMeta, POLL_INTERVAL);
