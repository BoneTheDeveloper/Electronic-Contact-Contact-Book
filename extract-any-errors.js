const fs = require('fs');

// Read ESLint JSON results
const webData = JSON.parse(fs.readFileSync('apps/web/eslint-web.json', 'utf8'));
const mobileData = JSON.parse(fs.readFileSync('apps/mobile/eslint-mobile.json', 'utf8'));

const webFiles = [];
const mobileFiles = [];

// Extract web files with any type errors
webData.forEach(result => {
  const anyErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-explicit-any');
  if (anyErrors.length > 0) {
    const relativePath = result.filePath.replace(/^C:\\Project\\electric_contact_book\\apps\\web\\/, '').replace(/\\/g, '/');
    webFiles.push({
      file: relativePath,
      count: anyErrors.length,
      errors: anyErrors.map(e => ({ line: e.line, col: e.column }))
    });
  }
});

// Extract mobile files with any type errors
mobileData.forEach(result => {
  const anyErrors = result.messages.filter(m => m.ruleId === '@typescript-eslint/no-explicit-any');
  if (anyErrors.length > 0) {
    const relativePath = result.filePath.replace(/^C:\\Project\\electric_contact_book\\apps\\mobile\\/, '').replace(/\\/g, '/');
    mobileFiles.push({
      file: relativePath,
      count: anyErrors.length,
      errors: anyErrors.map(e => ({ line: e.line, col: e.column }))
    });
  }
});

// Sort by count (descending)
webFiles.sort((a, b) => b.count - a.count);
mobileFiles.sort((a, b) => b.count - a.count);

// Output results
console.log('=== WEB APP ANY TYPE ERRORS ===');
console.log(`Total files: ${webFiles.length}`);
console.log(`Total errors: ${webFiles.reduce((s, f) => s + f.count, 0)}`);
console.log('');
webFiles.forEach(f => console.log(`  ${String(f.count).padStart(3)}  ${f.file}`));

console.log('');
console.log('=== MOBILE APP ANY TYPE ERRORS ===');
console.log(`Total files: ${mobileFiles.length}`);
console.log(`Total errors: ${mobileFiles.reduce((s, f) => s + f.count, 0)}`);
console.log('');
mobileFiles.forEach(f => console.log(`  ${String(f.count).padStart(3)}  ${f.file}`));

// Save to file
fs.writeFileSync('any-errors-report.json', JSON.stringify({ web: webFiles, mobile: mobileFiles }, null, 2));
console.log('');
console.log('Report saved to: any-errors-report.json');
