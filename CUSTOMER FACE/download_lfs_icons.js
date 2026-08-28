import fs from 'fs';
import path from 'path';
import https from 'https';

const ICONS_DIR = path.resolve('src/icons');
const BASE_URL = 'https://media.githubusercontent.com/media/Rayyan-624/ZM_App_Prototype/main/';

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Follow redirect
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: Status code ${response.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => resolve(dest));
      });
      fileStream.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  const allIcons = getAllFiles(ICONS_DIR);
  console.log(`Found ${allIcons.length} image files to check in src/icons...`);

  let count = 0;
  for (const filePath of allIcons) {
    let content = '';
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      // If binary, readFileSync as utf8 might fail or not start with Git LFS header
    }
    if (content.startsWith('version https://git-lfs.github.com/spec/v1')) {
      const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
      const url = BASE_URL + encodeURI(relPath);
      console.log(`[${++count}] Downloading: ${relPath}`);
      try {
        await downloadFile(url, filePath);
        const stats = fs.statSync(filePath);
        console.log(`  -> OK (${(stats.size / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`  -> ERROR downloading ${relPath}:`, err.message);
      }
    } else {
      console.log(`Skipping (already binary): ${filePath}`);
    }
  }

  console.log(`\nSuccessfully processed all ${count} Git LFS icons!`);
}

main().catch(console.error);
