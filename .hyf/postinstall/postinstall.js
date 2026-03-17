import { existsSync, mkdirSync, copyFileSync } from 'fs';
import path from 'path';

const __dirname = new URL('.', import.meta.url).pathname; // Get current directory path
const source = path.join(__dirname, 'settings.json');
const destination = path.join(__dirname, '../../.vscode/settings.json');

// Ensure the destination directory exists
const destDir = path.dirname(destination);
if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

try {
  copyFileSync(source, destination);
} catch (err) {
  console.error('Error copying file:', err);
  process.exit(1);
}
