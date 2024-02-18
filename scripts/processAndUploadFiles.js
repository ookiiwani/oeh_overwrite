// ECMAScript Module (ESM) Syntax
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const directoryPath = path.join(process.cwd(), 'overwrite'); // Geändert, um __dirname in ESM zu ersetzen
const result = {};

fs.readdirSync(directoryPath).forEach(file => {
    const fullPath = path.join(directoryPath, file);
    const stats = fs.statSync(fullPath);

    if (stats.isFile()) {
        const content = fs.readFileSync(fullPath, 'utf8');

        const parsed = path.parse(file);
        console.log("filename:", parsed.name, ", extension:", parsed.ext);

        let value;
        if (parsed.ext === '.json') {
            value = JSON.parse(content);
        } else {
            value = content;
        }

        _.set(result, parsed.name, value);
    } else {
        console.log(`${fullPath} ist ein Verzeichnis und wird übersprungen.`);
    }
});

const dataToSend = JSON.stringify({
    filename: 'oeh.json',
    content: JSON.stringify(result)
});

const token = process.env.AUTHORIZATION_TOKEN;

fetch('https://api.schickl.app/oeh.schickl.app/overwrite?filename=oeh.json', {
    method: 'PUT',
    body: dataToSend,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})
.then(response => response.json())
.then(json => console.log(json))
.catch(err => console.error('Error:', err));

