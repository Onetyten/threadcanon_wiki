import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app.js';
import userModel from '../models/userModel.js';
import blogModel from '../models/blogModel.js';
import jwt from 'jsonwebtoken';

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  // Set environment variable for test JWT_SECRET if not set
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create a test user
  const user = await userModel.create({
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: 'testpassword',
  });

  userId = user._id;

  // Generate JWT using env secret
  token = jwt.sign(
    { user: { id: userId, email: user.email } },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

afterEach(async () => {
  await blogModel.deleteMany({});
});

afterAll(async () => {
  await userModel.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /v1/api/blog/user/fetchposts', () => {
  it('should fetch published blogs with pagination', async () => {
    await blogModel.create([
      {
        userId,
        title: 'First Blog',
        body: 'This is the first blog post',
        state: 'published',
      },
      {
        userId,
        title: 'Second Blog',
        body: 'This is the second blog post',
        state: 'published',
      },
      {
        userId,
        title: 'Draft Blog',
        body: 'This is a draft blog post',
        state: 'draft',
      },
    ]);

    const res = await request(app)
      .get('/v1/api/blog/user/fetchposts?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.data.length).toBe(2);
  });

  it('should return 400 for invalid state', async () => {
    const res = await request(app)
      .get('/v1/api/blog/user/fetchposts?state=unknown')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid state/i);
  });

  it('should fetch draft blogs if requested', async () => {
    await blogModel.create({
      userId,
      title: 'Draft Only',
      body: 'This is a draft only blog post',
      state: 'draft',
    });

    const res = await request(app)
      .get('/v1/api/blog/user/fetchposts?state=draft')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].state).toBe('draft');
  });

  it('should return 404 if no blogs are found', async () => {
    const res = await request(app)
      .get('/v1/api/blog/user/fetchposts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message.toLowerCase()).toContain('no blogs');
  });

  it('should require authorization', async () => {
    const res = await request(app).get('/v1/api/blog/user/fetchposts');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
