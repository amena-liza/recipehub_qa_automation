import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sharedData.json is in the same folder as this file
const filePath = path.join(__dirname, 'sharedData.json');
console.log("Shared Store File Path:", filePath);

function setValue(key, value) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data[key] = value;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getValue(key) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data[key];
}

module.exports = { setValue, getValue };