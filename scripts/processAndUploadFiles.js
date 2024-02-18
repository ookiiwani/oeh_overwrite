const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const directoryPath = path.join( __dirname, '../overwrite' );
const result = {};

fs.readdirSync(directoryPath).forEach(file => {
    const fullPath = path.join(directoryPath, file);
    const stats = fs.statSync(fullPath);

    // Überprüfen, ob der Pfad zu einer Datei führt
    if (stats.isFile()) {
        const content = fs.readFileSync(fullPath, 'utf8');

        // Dateinamen in einen Pfad umwandeln und Dateiendung entfernen
	const parsed = path.parse(file);
        console.log( "filename:", parsed.name, ", extension:", parsed.ext );

        // Den Inhalt basierend auf der Dateiendung verarbeiten
        let value;
        if (parsed.ext === '.json') {
            value = JSON.parse(content);
        } else {
            value = content;
        }

        // Pfad im Ergebnisobjekt erstellen und Wert setzen
        _.set(result, parsed.name, value);
    } else {
        console.log(`${fullPath} ist ein Verzeichnis und wird übersprungen.`);
    }
});

const data = JSON.stringify(result);

fetch('https://api.schickl.app/oeh.schickl.app/overwrite?filename=oeh.json', {
    method: 'POST',
    body: data,
    headers: { 'Content-Type': 'application/json' }
})
.then(response => response.json())
.then(json => console.log(json))
.catch(err => console.error('Fehler beim Senden der Daten:', err));

// Das resultierende Objekt als JSON in eine Datei schreiben
const outputPath = path.join(__dirname, 'result.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

console.log('Die Dateien wurden erfolgreich in eine JSON-Datei zusammengeführt.');

