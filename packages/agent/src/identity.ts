import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// we'll store the agent's ID in a local file

const ID_FILE = path.join(__dirname, "..", ".agent-id");

export const getOrCreateAgentId = (): string => {
    // if the file exists, read and return the saved ID

    if (fs.existsSync(ID_FILE)) {
        const savedId = fs.readFileSync(ID_FILE, "utf-8").trim();
        console.log(`Loaded existing agent ID: ${savedId}`);
        return savedId;
    } 

    // If first time - generate a fresh uuid and save it
    const newId = uuidv4();
    fs.writeFileSync(ID_FILE, newId, "utf-8");
    console.log(`Generated new agent ID: ${newId}`);
    return newId;
};
