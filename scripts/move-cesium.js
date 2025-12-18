import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..');
const src = path.resolve(root, 'dist/GothicGIS/cesium');
const dest = path.resolve(root, 'dist/cesium');

if (fs.existsSync(src)) {
  console.log(`Moving ${src} to ${dest}...`);
  // Ensure parent directory exists (dist)
  if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
  }

  // If dest already exists, remove it first (or renameSync might fail or merge weirdly)
  if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
  }

  fs.renameSync(src, dest);

  // Clean up empty GothicGIS folder if needed
  try {
    fs.rmdirSync(path.resolve(root, 'dist/GothicGIS'));
  } catch (e) {
    // ignore
  }
  console.log('Done.');
} else {
  console.log(`Source ${src} does not exist. Skipping move.`);
}
