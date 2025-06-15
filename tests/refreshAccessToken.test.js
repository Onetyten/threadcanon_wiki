import request from 'supertest';
import { app } from '../app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import user from '../models/userModel.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
jest.setTimeout(30000)

dotenv.config({ path: '.env.test' });

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await user.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('POST /v1/auth/refreshAccessToken', () => {
  it('should return 200 and a new access token for a valid refresh token', async () => {
    // Create a valid refresh token
    const refreshToken = jwt.sign({ dummy: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

    const testUser = await user.create({
      email: 'luffy@onepiece.com',
      firstName: 'Monkey',
      lastName: 'D. Luffy',
      password: 'gomuGomuNoMi123',
      refreshTokens: [{ token: refreshToken, expiresAt }],
    });

    const res = await request(app)
      .post('/v1/auth/refreshAccessToken')
      .send({ refreshToken });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('user.token');
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should return 400 if no refresh token is provided', async () => {
    const res = await request(app)
      .post('/v1/auth/refreshAccessToken')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/refresh token is required/i);
  });

  it('should return 404 if refresh token does not match any user', async () => {
    const fakeRefreshToken = jwt.sign({ dummy: true }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const res = await request(app)
      .post('/v1/auth/refreshAccessToken')
      .send({ refreshToken: fakeRefreshToken });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/user not found/i);
  });

  it('should return 401 if refresh token is expired', async () => {
    const expiredToken = jwt.sign({ dummy: true }, process.env.JWT_SECRET, { expiresIn: '1s' });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const testUser = await user.create({
      email: 'zoro@onepiece.com',
      firstName: 'Roronoa',
      lastName: 'Zoro',
      password: 'santoryu456',
      refreshTokens: [{
        token: expiredToken,
        expiresAt: new Date(Date.now() - 1000), // expired
      }],
    });

      });
});
