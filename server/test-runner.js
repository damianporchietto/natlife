const { execSync } = require('child_process');
const path = require('path');

// Define test files to run
const testFiles = [
  'tests/authMiddleware.test.js',
  'tests/userController.test.js',
  'tests/mealController.test.js',
];

console.log('\nRunning NatLife API Tests\n');

// Run each test file
let hasErrors = false;

for (const testFile of testFiles) {
  const filePath = path.join(__dirname, testFile);
  console.log(`\nRunning tests in ${testFile}...\n`);
  
  try {
    // Use execSync to run the tests and capture output
    const output = execSync(`npx jest ${filePath} --verbose`, { stdio: 'inherit' });
  } catch (error) {
    hasErrors = true;
    console.error(`\nError running tests in ${testFile}`);
  }
}

console.log('\nAll tests completed');

// Exit with appropriate code
process.exit(hasErrors ? 1 : 0); 