// Set environment variables BEFORE imports
process.env.JWT_SECRET = 'test_secret'; // Must match what your app uses
process.env.NODE_ENV = 'test';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { app } from '../app.js';
import userModel from '../models/userModel.js';
import blogModel from '../models/blogModel.js';

jest.setTimeout(20000);

let mongoServer;
let token;
let blogId;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('In-memory MongoDB connected');

});

beforeEach(async () => {
  const user = await userModel.create({
    email: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'password123',
  });

  userId = user._id;

  token = jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  const blog = await blogModel.create({
    title: 'Original Title',
    description: 'Original description',
    body: 'Original blog body content',
    tags: ['test'],
    fandom: 'TestFandom',
    headImageUrl: 'http://example.com/image.jpg',
    userId: userId,
    readingTime: 1,
    timeStamp: { createdAt: Date.now(), updatedAt: Date.now() },
  });

  blogId = blog._id;
});


afterEach(async () => {
  await blogModel.deleteMany({});
  await userModel.deleteMany({});
  console.log('Test collections cleared.');
});


afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('In-memory MongoDB stopped');
});


describe('PATCH /v1/api/blog/user/edit/:id', () => {
  it('should successfully edit the blog if authorized and valid', async () => {
    const res = await request(app)
      .patch(`/v1/api/blog/user/edit/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Title',
        body: 'Updated blog content with more words',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Updated Title');
    expect(res.body.data.body).toBe('Updated blog content with more words');
  });

  it('should fail without Authorization header', async () => {
    const res = await request(app)
      .patch(`/v1/api/blog/user/edit/${blogId}`)
      .send({ title: 'New Title' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should fail if blog does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/v1/api/blog/user/edit/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Title' });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should fail if no fields are provided in body', async () => {
    const res = await request(app)
      .patch(`/v1/api/blog/user/edit/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
