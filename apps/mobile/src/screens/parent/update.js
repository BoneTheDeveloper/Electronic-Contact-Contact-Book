const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'Grades.template.txt'), 'utf-8');
fs.writeFileSync(path.join(__dirname, 'Grades.tsx'), content, 'utf-8');
console.log('Updated successfully');
