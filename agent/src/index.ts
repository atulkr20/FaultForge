import axios from 'axios';

// Configuration 
const CONTROL_PANEL_URL = 'http://localhost:3000';
const HOSTNAME ='prod-server-1'

async function checkForWork() {
    try {
        console.log(`[${new Date().toISOString()}] Checking for chaos commands... `);

        const response = await axios.post(`${CONTROL_PANEL_URL}/agents/register`, {
            hostname: HOSTNAME,
            ipAddress: "127.0.0.1" // Agents ipAddress
        });

        if (response.status === 200) {
            console.log("Successfully checked-in with control panel");
        }
    } catch (error) {
        console.error("Control Plane is unreachable. Retrying in 5s....");
    }
}

// POlling loop: Run every 5 seconds
setInterval(checkForWork, 5000);

console.log(`Agent started on ${HOSTNAME}. Awaiting orders....`);