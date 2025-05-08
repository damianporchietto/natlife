const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

// Set up JWT_SECRET for testing BEFORE requiring the middleware
process.env.JWT_SECRET = 'test-secret';

// Import test setup
require('./setup');

// Now require the auth middleware after setting JWT_SECRET
const authMiddleware = require('../middleware/auth');

describe('Auth Middleware', () => {
  // Mock Express request, response, and next function
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next() for valid token', () => {
    // Create a valid token
    const userId = new ObjectId();
    const user = { id: userId.toString(), username: 'testuser' };
    const token = jwt.sign(user, process.env.JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;

    // Debug logs
    console.log('Token:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    
    // Call the middleware
    authMiddleware(req, res, next);

    // Debug logs
    console.log('next called:', next.mock.calls.length);
    console.log('req.user:', req.user);
    console.log('res.status called:', res.status.mock.calls.length);
    console.log('res.json called:', res.json.mock.calls.length);
    
    // Verify middleware behavior
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(user.id);
    expect(req.user.username).toBe(user.username);
  });

  it('should return 401 when no token is provided', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when Authorization header is malformed', () => {
    req.headers.authorization = 'Invalid-Format';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    req.headers.authorization = 'Bearer invalid.token.here';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });
}); 