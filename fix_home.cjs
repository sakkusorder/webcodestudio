const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/Home.tsx');
let content = fs.readFileSync(file, 'utf-8');

if (!content.includes('import { getStoredTemplates } from')) {
    content = content.replace(/import \{ (.*?) \} from '\.\.\/data\/templates';/, "import { $1, getStoredTemplates } from '../data/templates';");
    if (!content.includes('getStoredTemplates } from')) {
        content = "import { getStoredTemplates } from '../data/templates';\n" + content;
    }
}
fs.writeFileSync(file, content, 'utf-8');
