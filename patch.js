const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');
content = content.replace(
  "useEffect(() => {\n    const handleStorage = () => setTemplates(getStoredTemplates());",
  "useEffect(() => {\n    fetchTemplates().then(data => {\n      if (data && data.length > 0) setTemplates(data);\n    });\n    const handleStorage = () => setTemplates(getStoredTemplates());"
);
fs.writeFileSync('src/pages/Home.tsx', content);
