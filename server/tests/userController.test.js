const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Import test setup
require('./setup');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api', userRoutes);

describe('User Controller', () => {
  // Test user registration
  describe('POST /api/register', () => {
    it('should register a new user successfully', async () => {
      const userData = { username: 'testuser', password: 'password123' };
      
      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(200);
      
      expect(response.body.message).toBe('Registration successful');
      expect(response.body.username).toBe(userData.username);
      
      // Verify user was saved to the database
      const user = await User.findOne({ username: userData.username });
      expect(user).not.toBeNull();
      expect(user.username).toBe(userData.username);
    });
    
    it('should return 400 if username is already taken', async () => {
      // Create a user first
      const userData = { username: 'existinguser', password: 'password123' };
      await new User(userData).save();
      
      // Try to register with the same username
      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(400);
      
      expect(response.body.error).toBe('Username already taken');
    });
    
    it('should return 400 if username or password is missing', async () => {
      // Missing password
      let response = await request(app)
        .post('/api/register')
        .send({ username: 'testuser' })
        .expect(400);
      
      expect(response.body.error).toBe('Username and password required');
      
      // Missing username
      response = await request(app)
        .post('/api/register')
        .send({ password: 'password123' })
        .expect(400);
      
      expect(response.body.error).toBe('Username and password required');
    });
  });
  
  // Test user login
  describe('POST /api/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      const userData = { username: 'loginuser', password: 'password123' };
      await new User(userData).save();
    });
    
    it('should login successfully with correct credentials', async () => {
      const loginData = { username: 'loginuser', password: 'password123' };
      
      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(200);
      
      expect(response.body.message).toBe('Login successful');
      expect(response.body.username).toBe(loginData.username);
      expect(response.body.token).toBeDefined();
      
      // Verify the token is valid
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET || 'dev_secret');
      expect(decoded.username).toBe(loginData.username);
    });
    
    it('should return 400 with incorrect password', async () => {
      const loginData = { username: 'loginuser', password: 'wrongpassword' };
      
      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(400);
      
      expect(response.body.error).toBe('Invalid credentials');
    });
    
    it('should return 400 with non-existent username', async () => {
      const loginData = { username: 'nonexistentuser', password: 'password123' };
      
      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(400);
      
      expect(response.body.error).toBe('Invalid credentials');
    });
    
    it('should return 400 if username or password is missing', async () => {
      // Missing password
      let response = await request(app)
        .post('/api/login')
        .send({ username: 'loginuser' })
        .expect(400);
      
      expect(response.body.error).toBe('Username and password required');
      
      // Missing username
      response = await request(app)
        .post('/api/login')
        .send({ password: 'password123' })
        .expect(400);
      
      expect(response.body.error).toBe('Username and password required');
    });
  });
}); 