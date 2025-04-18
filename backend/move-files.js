import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directories = ['routes', 'controllers', 'models', 'middleware', 'utils'];

directories.forEach(dir => {
    // Create src directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'src'))) {
        fs.mkdirSync(path.join(__dirname, 'src'));
    }

    // Create target directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'src', dir))) {
        fs.mkdirSync(path.join(__dirname, 'src', dir));
    }

    // Move files if source directory exists
    if (fs.existsSync(path.join(__dirname, dir))) {
        const files = fs.readdirSync(path.join(__dirname, dir));
        files.forEach(file => {
            const sourcePath = path.join(__dirname, dir, file);
            const targetPath = path.join(__dirname, 'src', dir, file);
            
            if (fs.existsSync(sourcePath)) {
                fs.renameSync(sourcePath, targetPath);
                console.log(`Moved ${sourcePath} to ${targetPath}`);
            }
        });

        // Remove empty source directory
        fs.rmdirSync(path.join(__dirname, dir));
        console.log(`Removed empty directory: ${dir}`);
    }
}); 