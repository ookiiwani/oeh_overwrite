// processAndUploadFiles.js
const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');
const token = process.env.AUTHORIZATION_TOKEN;

async function processAndUploadFiles() {
  const directoryPath = path.join(__dirname); // Anpassen, falls das Skript in einem Unterordner liegt
  try {
    const files = await fs.readdir(directoryPath);
    const filesData = await Promise.all(
      files.filter(file => file.endsWith('.md') || file.endsWith('.json'))
      .map(async file => {
        const fileName = file.replace(/\.md$|\.json$/, '');
        const content = await fs.readFile(path.join(directoryPath, file), 'utf8');
        return { [fileName]: content };
      })
    );

    await axios.put('https://api.schickl.app/oeh.schickl.app/overwrite', filesData, {
      headers: { 'Authorization': token }
    });

    console.log('Daten erfolgreich übertragen');
  } catch (error) {
    console.error('Fehler beim Verarbeiten oder Übertragen der Dateien:', error);
  }
}

processAndUploadFiles();
