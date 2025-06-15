import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import { app } from '../app.js';
import user from '../models/userModel.js';
import blog from '../models/blogModel.js';

dotenv.config({ path: '.env.test' });

let mongoServer;
let authToken;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create test user
  const newUser = await user.create({
    email: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'testpassword123',
  });

  userId = newUser._id;

  // Generate token
  authToken = jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterEach(async () => {
  await blog.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /v1/api/blog/create', () => {
  it('should return 201 and create a blog post with valid data and token', async () => {
    const res = await request(app)
      .post('/v1/api/blog/create?state=published')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'A New Blog Post',
        description: 'Short description',
        body: 'This is the content of the blog post.',
        tags: ['testing', 'jest'],
        fandom: 'Test Fandom',
        headImageUrl: 'https://example.com/image.png',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('title', 'A New Blog Post');
    expect(res.body.data).toHaveProperty('state', 'published');

    const createdBlog = await blog.findOne({ title: 'A New Blog Post' });
    expect(createdBlog).not.toBeNull();
    expect(createdBlog.userId.toString()).toBe(userId.toString());
  });

  it('should return 400 if required fields (title/body) are missing', async () => {
    const res = await request(app)
      .post('/v1/api/blog/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ description: 'Only description provided' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid request/i);
  });

  it('should return 401 if no auth token is provided', async () => {
    const res = await request(app)
      .post('/v1/api/blog/create')
      .send({
        title: 'Unauthorized Post',
        body: 'This should fail',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
