import request from 'supertest';
import { app } from '../app.js'; // Assuming app is exported from app.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import user from '../models/userModel.js';
import dotenv from 'dotenv';

// Load the .env.test file from the project root
dotenv.config({ path: '.env.test' });

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('In-memory MongoDB connected for signup tests');
});

afterEach(async () => {
  // Clean up users collection after each test
  await user.deleteMany({});
  console.log('Users collection cleared.');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('In-memory MongoDB connection closed for signup tests.');
});

describe('POST /v1/auth/signup', () => {
  // check if the endpoint is working as intended
  it('should return 201 and create a new user', async () => {
    const res = await request(app)
      .post('/v1/auth/signup')
      .send({
        email: 'yagami@gmail.com',
        firstName: 'Light',
        lastName: 'Yagami',
        password: 'deathnote123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('yagami@gmail.com');

    // Verify user was actually saved to the DB
    const savedUser = await user.findOne({ email: 'yagami@gmail.com' });
    expect(savedUser).not.toBeNull();
  });

  it('should return 400 if essential data is missing', async () => {
    const res = await request(app)
      .post('/v1/auth/signup')
      .send({
        email: '', // Missing email
        firstName: 'Light',
        lastName: 'Yagami',
        password: 'deathnote123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('message'); // Or specific error message from your API
  });

  // Add more tests for validation, duplicate emails, etc.
});