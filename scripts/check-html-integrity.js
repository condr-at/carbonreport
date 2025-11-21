const fs = require('fs');
const path = require('path');

const files = [
  '15_RisingSmall.html',
  '16_NetworkIllustration.html',
  '17_CodeEditorIllustration.html',
  '18_InfrastructureIllustration.html'
];

const dir = path.join(process.cwd(), 'src/app/illustrations-demo/Launch UI/card-snippets');

files.forEach(file => {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`Checking ${file}...`);
  
  // Check for unclosed quotes
  let inQuote = false;
  let quoteChar = '';
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (inQuote) {
      if (char === quoteChar) {
        inQuote = false;
      }
    } else {
      if (char === '"' || char === "'") {
        inQuote = true;
        quoteChar = char;
      }
    }
  }
  if (inQuote) {
    console.log(`  ERROR: Unclosed quote (${quoteChar})`);
  } else {
    console.log(`  Quotes balanced.`);
  }

  // Check for fixed position
  if (content.includes('fixed')) {
    console.log(`  WARNING: Contains 'fixed' position.`);
  }

  // Check for script/style tags
  if (content.includes('<script')) {
    console.log(`  WARNING: Contains <script> tag.`);
  }
  if (content.includes('<style')) {
    console.log(`  WARNING: Contains <style> tag.`);
  }

  // Check for balanced tags (simple stack)
  const tags = [];
  const regex = /<\/?([a-z0-9]+)[^>]*>/gi;
  let match;
  let balanced = true;
  
  // Remove comments first
  const contentNoComments = content.replace(/<!--[\s\S]*?-->/g, '');

  while ((match = regex.exec(contentNoComments)) !== null) {
    const tag = match[0];
    const tagName = match[1].toLowerCase();
    const isClosing = tag.startsWith('</');
    const isSelfClosing = tag.endsWith('/>') || ['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName);

    if (isClosing) {
      if (tags.length === 0) {
        console.log(`  ERROR: Unexpected closing tag </${tagName}> at index ${match.index}`);
        balanced = false;
      } else {
        const lastTag = tags.pop();
        if (lastTag !== tagName) {
          console.log(`  ERROR: Mismatched closing tag </${tagName}>. Expected </${lastTag}> at index ${match.index}`);
          balanced = false;
        }
      }
    } else if (!isSelfClosing) {
      tags.push(tagName);
    }
  }

  if (tags.length > 0) {
    console.log(`  ERROR: Unclosed tags: ${tags.join(', ')}`);
    balanced = false;
  }

  if (balanced) {
    console.log(`  Tags balanced.`);
  }
  console.log('---');
});
