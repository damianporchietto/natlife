# NatLife Backend API

The backend API for the NatLife fitness application, built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables in a `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/natlife
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. For production:
   ```
   npm start
   ```

## Testing

The backend comes with a comprehensive test suite using Jest and Supertest. The tests run with an in-memory MongoDB server to prevent touching your actual database.

### Running Tests

1. Run all tests:
   ```
   npm test
   ```

2. Run tests in watch mode (during development):
   ```
   npm run test:watch
   ```

3. Run specific test files:
   ```
   npm test tests/userController.test.js
   ```

4. Run all tests using the custom test runner:
   ```
   npm run test:full
   ```

### Test Structure

The tests are organized as follows:

- `tests/setup.js`: Sets up the test environment with a MongoDB memory server
- `tests/authMiddleware.test.js`: Tests for authentication middleware
- `tests/userController.test.js`: Tests for user authentication operations
- `tests/mealController.test.js`: Tests for meal plan CRUD operations

### Writing New Tests

To add new tests, create a file in the `tests` directory following the naming convention `*.test.js`.

Example:

```javascript
const request = require('supertest');
const app = express();
// Import the necessary routes and middleware

// Import the test setup
require('./setup');

describe('My Feature', () => {
  it('should do something correctly', async () => {
    // Test code here
    const response = await request(app).get('/api/endpoint');
    expect(response.status).toBe(200);
  });
});
```

## API Endpoints

### Authentication
- `POST /api/register`: Register a new user
- `POST /api/login`: Login a user

### Meal Plans
- `GET /api/meals`: Get all meal plans for the logged-in user
- `POST /api/meals`: Create a new meal plan
- `PUT /api/meals/:id`: Update a meal plan
- `DELETE /api/meals/:id`: Delete a meal plan

### Workouts
- `GET /api/workouts`: Get all workout plans for the logged-in user
- `POST /api/workouts`: Create a new workout plan
- `PUT /api/workouts/:id`: Update a workout plan
- `DELETE /api/workouts/:id`: Delete a workout plan

### Reports
- `GET /api/reports/meals`: Generate a CSV report of meal plans
- `GET /api/reports/workouts`: Generate a CSV report of all workout plans
- `GET /api/reports/workouts/:id`: Generate a CSV report for a specific workout plan 