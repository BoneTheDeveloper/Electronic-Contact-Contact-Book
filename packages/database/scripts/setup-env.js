const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', 'prisma', '.env');
const envExamplePath = path.join(__dirname, '..', 'prisma', '.env.example');

// Create .env from .env.example if it doesn't exist
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file for local development...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created at prisma/.env');
  console.log('📝 Using SQLite for local development (file:./dev.db)');
} else {
  console.log('✅ .env file already exists');
}
