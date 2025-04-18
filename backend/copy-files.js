import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${srcPath} to ${destPath}`);
        }
    }
}

// Create src directory if it doesn't exist
const srcDir = path.join(__dirname, 'src');
if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir);
}

// Copy each directory
const directories = ['routes', 'controllers', 'models', 'middleware', 'utils'];
directories.forEach(dir => {
    const sourceDir = path.join(__dirname, dir);
    const targetDir = path.join(__dirname, 'src', dir);

    if (fs.existsSync(sourceDir)) {
        copyDir(sourceDir, targetDir);
        console.log(`Copied directory ${dir} to src/${dir}`);
    }
}); 