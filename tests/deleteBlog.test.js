import request from 'supertest';
import { app } from '../app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/userModel.js';
import Blog from '../models/blogModel.js';
import jwt from 'jsonwebtoken';

let mongoServer;
let token;
let userId;
let blogId;

jest.setTimeout(30000);

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('In-memory MongoDB connected');
  } catch (err) {
    console.error('Error connecting to in-memory MongoDB', err);
  }
});

beforeEach(async () => {
  try {
    await User.deleteMany({});
    await Blog.deleteMany({});

    // Create a test user
    const user = await User.create({
      email: 'testuser@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123',
    });

    userId = user._id;

    // Use environment variable for secret
    token = jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET || 'testsecret', {
      expiresIn: '1h',
    });

    // Create a blog for that user
    const blog = await Blog.create({
      title: 'Test Blog',
      body: 'This is a test blog content.',
      userId: userId,
      state: 'draft',
    });

    blogId = blog._id;
  } catch (err) {
    console.error('Error in beforeEach', err);
  }
});

afterAll(async () => {
  try {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('In-memory MongoDB stopped');
  } catch (err) {
    console.error('Error disconnecting from MongoDB', err);
  }
});

describe('DELETE /v1/api/blog/user/delete/:id', () => {
  it('should delete a blog successfully when authorized', async () => {
    const res = await request(app)
      .delete(`/v1/api/blog/user/delete/${blogId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);

    const blogInDb = await Blog.findById(blogId);
    expect(blogInDb).toBeNull(); // Ensure blog was removed
  });

  it('should return 404 if blog not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/v1/api/blog/user/delete/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/blog not found/i);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).delete(`/v1/api/blog/user/delete/${blogId}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/authorization header not found/i);
  });

  it('should return 401 if trying to delete another user’s blog', async () => {
    const secondUser = await User.create({
      email: 'otheruser@gmail.com',
      firstName: 'Other',
      lastName: 'User',
      password: 'password456',
    });

    const otherToken = jwt.sign(
      { user: { id: secondUser._id } },
      process.env.JWT_SECRET || 'testsecret'
    );

    const newBlog = await Blog.create({
      title: 'Another Blog',
      body: 'Owned by first user',
      userId: userId, // original user
    });

    const res = await request(app)
      .delete(`/v1/api/blog/user/delete/${newBlog._id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not authorized/i);
  });
});
