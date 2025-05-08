const request = require('supertest');
const express = require('express');
const mealRoutes = require('../routes/mealRoutes');
const MealPlan = require('../models/MealPlan');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
// Import test setup
require('./setup');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/meals', mealRoutes);

const testUserId = '663888888888888888888888';

// Mock auth middleware for testing
jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    req.user = { id: testUserId, username: 'testuser' };
    next();
  };
});

describe('Meal Controller', () => {
  describe('GET /api/meals', () => {
    it('should get all meal plans for the user', async () => {
      // Create some test meal plans
      const mealPlans = [
        {
          user_id: new ObjectId(testUserId),
          day: 'Monday',
          meals: [
            { 
              label: 'Breakfast', 
              time: '08:00',
              items: [{ food: 'Eggs', qty: 2, unit: 'unit', protein: 12, carbs: 0, fat: 10 }]
            }
          ]
        },
        {
          user_id: new ObjectId(testUserId),
          day: 'Tuesday',
          meals: [
            { 
              label: 'Lunch', 
              time: '12:00',
              items: [{ food: 'Chicken Salad', qty: 1, unit: 'bowl', protein: 25, carbs: 15, fat: 10 }]
            }
          ]
        }
      ];
      
      // Insert the test data
      await MealPlan.insertMany(mealPlans);
      
      // Make the request
      const response = await request(app)
        .get('/api/meals')
        .expect(200);
      
      expect(response.body).toHaveLength(2);
      expect(response.body[0].day).toBe('Monday');
      expect(response.body[1].day).toBe('Tuesday');
    });
  });
  
  describe('POST /api/meals', () => {
    it('should create a new meal plan', async () => {
      const mealPlanData = {
        day: 'Wednesday',
        meals: [
          {
            label: 'Dinner',
            time: '18:00',
            items: [
              { food: 'Salmon', qty: 200, unit: 'g', protein: 40, carbs: 0, fat: 20 },
              { food: 'Rice', qty: 100, unit: 'g', protein: 2, carbs: 80, fat: 1 }
            ]
          }
        ]
      };
      
      const response = await request(app)
        .post('/api/meals')
        .send(mealPlanData)
        .expect(201);
      
      expect(response.body.day).toBe(mealPlanData.day);
      expect(response.body.meals).toHaveLength(1);
      expect(response.body.meals[0].label).toBe('Dinner');
      expect(response.body.meals[0].items).toHaveLength(2);
      
      // Verify it was saved to the database
      const savedMealPlan = await MealPlan.findById(response.body._id);
      expect(savedMealPlan).not.toBeNull();
      expect(savedMealPlan.day).toBe(mealPlanData.day);
    });
  });
  
  describe('PUT /api/meals/:id', () => {
    it('should update an existing meal plan', async () => {
      // Create a meal plan first
      const mealPlan = new MealPlan({
        _id: new ObjectId(),
        user_id: new ObjectId(testUserId),
        day: 'Thursday',
        meals: [
          { 
            label: 'Breakfast', 
            time: '08:00',
            items: [{ food: 'Toast', qty: 2, unit: 'slice', protein: 4, carbs: 30, fat: 1 }]
          }
        ]
      });
      
      await mealPlan.save();
      
      // Update data
      const updateData = {
        day: 'Thursday',
        meals: [
          { 
            label: 'Breakfast', 
            time: '09:00', // Changed time
            items: [
              { food: 'Toast', qty: 2, unit: 'slice', protein: 4, carbs: 30, fat: 1 },
              { food: 'Coffee', qty: 1, unit: 'cup', protein: 0, carbs: 0, fat: 0 } // Added item
            ]
          }
        ]
      };
      
      const response = await request(app)
        .patch(`/api/meals/${mealPlan._id}`)
        .send(updateData)
        .expect(200);
      
      expect(response.body.meals[0].time).toBe('09:00');
      expect(response.body.meals[0].items).toHaveLength(2);
      
      // Verify the update in database
      const updated = await MealPlan.findById(mealPlan._id);
      expect(updated.meals[0].time).toBe('09:00');
      expect(updated.meals[0].items).toHaveLength(2);
    });
    
    it('should return 404 if meal plan is not found', async () => {
      const nonExistentId = new ObjectId();
      
      const response = await request(app)
        .patch(`/api/meals/${nonExistentId}`)
        .send({ day: 'Friday', meals: [] })
        .expect(404);      
      expect(response.body.error).toBe('Meal plan not found');
    });
  });
  
  describe('DELETE /api/meals/:id', () => {
    it('should delete a meal plan', async () => {
      // Create a meal plan first
      const mealPlan = new MealPlan({
        user_id: new ObjectId(testUserId),
        day: 'Friday',
        meals: [
          { 
            label: 'Lunch', 
            time: '12:00',
            items: [{ food: 'Sandwich', qty: 1, unit: 'unit', protein: 15, carbs: 40, fat: 10 }]
          }
        ]
      });
      
      await mealPlan.save();
      
      const response = await request(app)
        .delete(`/api/meals/${mealPlan._id}`)
        .expect(200);
      
      expect(response.body.message).toBe('Meal plan deleted');
      expect(response.body.id).toBe(mealPlan._id.toString());
      
      // Verify it was deleted from the database
      const deleted = await MealPlan.findById(mealPlan._id);
      expect(deleted).toBeNull();
    });
    
    it('should return 404 if meal plan is not found', async () => {
      const nonExistentId = new ObjectId();
      
      const response = await request(app)
        .delete(`/api/meals/${nonExistentId}`)
        .expect(404);      
      expect(response.body.error).toBe('Meal plan not found');
    });
  });
}); 