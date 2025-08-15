// Simple test script to verify build process
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing MPL Web build process...');

try {
  // Check if dist folder exists and remove it
  if (fs.existsSync('dist')) {
    console.log('🗑️  Removing existing dist folder...');
    fs.rmSync('dist', { recursive: true, force: true });
  }
  
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🔨 Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if dist folder was created
  if (fs.existsSync('dist')) {
    console.log('✅ Build successful! Dist folder created.');
    console.log('📁 Dist folder contents:');
    const files = fs.readdirSync('dist');
    files.forEach(file => {
      const stats = fs.statSync(path.join('dist', file));
      console.log(`  ${file} (${stats.isDirectory() ? 'dir' : 'file'})`);
    });
  } else {
    console.log('❌ Build failed! Dist folder not found.');
  }
  
} catch (error) {
  console.error('💥 Build test failed:', error.message);
  process.exit(1);
}
