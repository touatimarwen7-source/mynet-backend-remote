/**
 * Controller Unit Tests - Phase 1 (10 Tests)
 * Tests for: Auth, Offer, Review Controllers
 * 
 * @test Authentication & Authorization
 * @test Data Validation & Input Sanitization
 * @test Error Handling & Response Formats
 */

const request = require('supertest');
const AuthController = require('../controllers/authController');
const OfferController = require('../controllers/procurement/OfferController');

describe('Controller Unit Tests - 10 Tests', () => {
  
  // ============= AUTH CONTROLLER TESTS =============
  
  /**
   * Test 1: AuthController.register() with valid data
   * Expected: User created successfully
   */
  test('AuthController.register should create user with valid input', async () => {
    const mockReq = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePass123!',
        full_name: 'Test User',
        role: 'supplier'
      }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock UserService
    jest.mock('../services/UserService', () => ({
      createUser: jest.fn().mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'supplier'
      })
    }));

    await AuthController.register(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'User registered successfully'
      })
    );
  });

  /**
   * Test 2: AuthController.register() with missing email
   * Expected: 400 Bad Request with validation error
   */
  test('AuthController.register should reject missing email', async () => {
    const mockReq = {
      body: {
        username: 'testuser',
        password: 'SecurePass123!'
        // email missing
      }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await AuthController.register(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('required')
      })
    );
  });

  /**
   * Test 3: AuthController.login() with valid credentials
   * Expected: 200 OK with auth token
   */
  test('AuthController.login should authenticate valid user', async () => {
    const mockReq = {
      body: {
        email: 'test@example.com',
        password: 'SecurePass123!'
      }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.mock('../services/UserService', () => ({
      authenticateUser: jest.fn().mockResolvedValue({
        accessToken: 'mock_token_123',
        user: { id: 1, email: 'test@example.com' }
      })
    }));

    await AuthController.login(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Login successful'
      })
    );
  });

  /**
   * Test 4: AuthController.login() with missing password
   * Expected: 400 Bad Request with validation error
   */
  test('AuthController.login should reject missing password', async () => {
    const mockReq = {
      body: {
        email: 'test@example.com'
        // password missing
      }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await AuthController.login(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('required')
      })
    );
  });

  /**
   * Test 5: AuthController.getProfile() with valid user
   * Expected: 200 OK with user profile
   */
  test('AuthController.getProfile should return user profile', async () => {
    const mockReq = {
      user: { userId: 1 }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.mock('../services/UserService', () => ({
      getUserById: jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        username: 'testuser'
      })
    }));

    await AuthController.getProfile(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        user: expect.any(Object)
      })
    );
  });

  // ============= OFFER CONTROLLER TESTS =============

  /**
   * Test 6: OfferController.createOffer() with valid data
   * Expected: 201 Created with offer details
   */
  test('OfferController.createOffer should create offer with valid input', async () => {
    const mockReq = {
      body: {
        tender_id: 1,
        total_amount: 5000,
        delivery_time: '30 days',
        technical_proposal: 'High quality solution'
      },
      user: { userId: 1 }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.mock('../services/OfferService', () => ({
      createOffer: jest.fn().mockResolvedValue({
        id: 1,
        tender_id: 1,
        total_amount: 5000,
        status: 'submitted'
      })
    }));

    await OfferController.createOffer(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Offer submitted successfully'
      })
    );
  });

  /**
   * Test 7: OfferController.getOffer() with valid offer ID
   * Expected: 200 OK with offer details
   */
  test('OfferController.getOffer should return offer by ID', async () => {
    const mockReq = {
      params: { id: 1 },
      user: { userId: 1 }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.mock('../services/OfferService', () => ({
      getOfferById: jest.fn().mockResolvedValue({
        id: 1,
        tender_id: 1,
        total_amount: 5000,
        status: 'submitted',
        is_sealed: false
      })
    }));

    await OfferController.getOffer(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        offer: expect.any(Object)
      })
    );
  });

  /**
   * Test 8: OfferController.getOffer() with invalid offer ID
   * Expected: 404 Not Found
   */
  test('OfferController.getOffer should return 404 for non-existent offer', async () => {
    const mockReq = {
      params: { id: 999 },
      user: { userId: 1 }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.mock('../services/OfferService', () => ({
      getOfferById: jest.fn().mockResolvedValue(null)
    }));

    await OfferController.getOffer(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('not found')
      })
    );
  });

  /**
   * Test 9: OfferController.evaluateOffer() with valid score
   * Expected: 200 OK with evaluated offer
   */
  test('OfferController.evaluateOffer should evaluate with valid score', async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        score: 8.5,
        notes: 'Good technical proposal'
      },
      user: { userId: 1 }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.mock('../services/OfferService', () => ({
      evaluateOffer: jest.fn().mockResolvedValue({
        id: 1,
        score: 8.5,
        notes: 'Good technical proposal',
        status: 'evaluated'
      })
    }));

    await OfferController.evaluateOffer(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Offer evaluated successfully'
      })
    );
  });

  /**
   * Test 10: OfferController.evaluateOffer() with missing score
   * Expected: 400 Bad Request
   */
  test('OfferController.evaluateOffer should reject missing score', async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        notes: 'Good proposal'
        // score missing
      },
      user: { userId: 1 }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await OfferController.evaluateOffer(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('required')
      })
    );
  });
});
