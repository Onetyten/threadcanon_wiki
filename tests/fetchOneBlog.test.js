import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app.js';
import blog from '../models/blogModel.js';
import user from '../models/userModel.js';

let mongoServer;
let testUser;
let testBlog;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a test user
  testUser = await user.create({
    email: 'testuser@example.com',
    password: 'testpassword',
    firstName: 'Test',
    lastName: 'User',
    profileImageUrl: 'http://example.com/profile.jpg',
  });

  // Create a published blog
  testBlog = await blog.create({
    userId: testUser._id,
    title: 'Test Blog',
    description: 'Test Description',
    author: 'Test Author',
    state: 'published',
    body: 'This is the blog content.',
  });
});

afterAll(async () => {
  await blog.deleteMany({});
  await user.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /v1/api/blog/fetchone/:id', () => {
  it('should fetch the blog with the correct ID if it is published', async () => {
    const res = await request(app).get(`/v1/api/blog/fetchone/${testBlog._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Test Blog');
    expect(res.body.authorProfile.email).toBe('testuser@example.com');
  });

  it('should return 404 for an invalid or unpublished blog ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/v1/api/blog/fetchone/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/no blog found/i);
  });
});
