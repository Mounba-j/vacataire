const fs = require('fs');
const path = require('path');

function fixInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix string escaping error. 
      // Need to replace \'2.5rem\' with '2.5rem'
      const oldStr1 = "style={{ paddingLeft: \\\'2.5rem\\\' }}";
      const newStr1 = "style={{ paddingLeft: '2.5rem' }}";
      
      // I'll just use a safe regex that replaces literal \' with '
      if (content.includes("\\'2.5rem\\'")) {
         content = content.replace(/\\'/g, "'");
         fs.writeFileSync(fullPath, content);
      }
    }
  }
}
fixInDir('C:/Users/USER/Desktop/antigravityTest/Vacataire/src');
