#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Starting build test...\n');

// Helper function to check if file exists
const fileExists = (filePath) => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
};

// Helper function to run command
const runCommand = (command, description) => {
  console.log(`📌 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} - Success\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} - Failed\n`);
    return false;
  }
};

// Main test function
const runBuildTest = () => {
  let allTestsPassed = true;

  // 1. Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  console.log('✅ Clean complete\n');

  // 2. Run build command
  if (!runCommand('npm run build', 'Building plugin')) {
    allTestsPassed = false;
    return allTestsPassed;
  }

  // 3. Verify build output
  console.log('🔍 Verifying build output...');
  
  const requiredFiles = [
    'dist/admin/index.js',
    'dist/admin/index.mjs',
    'dist/server/index.js',
    'dist/server/index.mjs',
  ];

  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fileExists(file)) {
      missingFiles.push(file);
      allTestsPassed = false;
    }
  });

  if (missingFiles.length > 0) {
    console.error('❌ Missing build files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    console.log('');
  } else {
    console.log('✅ All required build files present\n');
  }

  // 4. Check file sizes
  console.log('📊 Checking build file sizes...');
  
  requiredFiles.forEach(file => {
    if (fileExists(file)) {
      const stats = fs.statSync(file);
      const fileSizeInKB = (stats.size / 1024).toFixed(2);
      
      if (stats.size === 0) {
        console.error(`❌ ${file} is empty!`);
        allTestsPassed = false;
      } else {
        console.log(`   ✓ ${file}: ${fileSizeInKB} KB`);
      }
    }
  });
  console.log('');

  // 5. Verify exports structure
  console.log('🔧 Verifying export structure...');
  
  try {
    // Check if we can require the built files
    const adminBuild = require(path.resolve('dist/admin/index.js'));
    const serverBuild = require(path.resolve('dist/server/index.js'));
    
    if (typeof adminBuild.default !== 'object') {
      console.error('❌ Admin build does not export default object');
      allTestsPassed = false;
    } else {
      console.log('   ✓ Admin build exports verified');
    }
    
    if (typeof serverBuild.default !== 'object') {
      console.error('❌ Server build does not export default object');
      allTestsPassed = false;
    } else {
      console.log('   ✓ Server build exports verified');
    }
  } catch (error) {
    console.error('❌ Error verifying exports:', error.message);
    allTestsPassed = false;
  }
  console.log('');

  // 6. Summary
  console.log('📋 Build Test Summary:');
  if (allTestsPassed) {
    console.log('✅ All build tests passed!');
  } else {
    console.log('❌ Some build tests failed!');
  }

  return allTestsPassed;
};

// Run the test
const success = runBuildTest();
process.exit(success ? 0 : 1);