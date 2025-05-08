const { connectTestDB, closeTestDB, clearDatabase } = require('../config/test-db');

// Setup before all tests
beforeAll(async () => {
  await connectTestDB();
});

// Clean up database between tests
beforeEach(async () => {
  await clearDatabase();
});

// Close connection after all tests
afterAll(async () => {
  await closeTestDB();
}); 