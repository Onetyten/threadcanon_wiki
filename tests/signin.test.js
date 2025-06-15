// tests/signin.test.js
import request from 'supertest';
import { app } from '../app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import user from '../models/userModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

let mongoServer;

describe('POST /v1/auth/signin', () => {
  const testPassword = 'Notebook';
  const testUserEmail = 'yagami@gmail.com';
  const testUserFirstName = 'Light';
  const testUserLastName = 'Yagami';

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
    await mongoServer.stop();
  });

  it('should return 200 and log in user with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await user.create({
      email: testUserEmail,
      firstName: testUserFirstName,
      lastName: testUserLastName,
      password: hashedPassword,
    });

    const res = await request(app)
      .post('/v1/auth/signin')
      .send({ email: testUserEmail, password: testPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUserEmail.toLowerCase());
    expect(res.body).toHaveProperty('token');
  });


  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/v1/auth/signin')
      .send({ email: '', password: testPassword });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 404 if user not found', async () => {
    // No user created, so findOne will return null from the DB
    const res = await request(app)
      .post('/v1/auth/signin')
      .send({
        email: testUserEmail,
        password: testPassword,
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 if password is incorrect', async () => {
    // Create user with the correct password
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await user.create({
      email: testUserEmail,
      firstName: testUserFirstName,
      lastName: testUserLastName,
      password: hashedPassword,
    });

    const res = await request(app)
      .post('/v1/auth/signin')
      .send({
        email: testUserEmail,
        password: 'wrongPassword', // Attempt login with an incorrect password
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
