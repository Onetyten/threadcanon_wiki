import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app.js'; // Adjust path as needed
import blog from '../models/blogModel.js';
import user from '../models/userModel.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
  console.log('In-memory MongoDB connected');
});

afterEach(async () => {
  await blog.deleteMany({});
  await user.deleteMany({});
  console.log('Collections cleared after test');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('In-memory MongoDB stopped');
});

describe('GET /v1/api/blog/fetch', () => {
  it('should return 200 and fetched blogs successfully', async () => {
    const testUser = await user.create({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'test1234'
    });

    await blog.create({
      userId: testUser._id,
      title: 'My First Blog',
      description: 'Test blog description',
      author: 'Test Author',
      body: 'This is the body of the blog',
      state: 'published',
      tags: ['test', 'sample'],
      fandom: 'test-fandom'
    });

    const res = await request(app).get('/v1/api/blog/fetch');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('title', 'My First Blog');
    expect(res.body.data[0]).toHaveProperty('author', 'Test Author');
  });

  it('should return 404 if no blogs are available', async () => {
    const res = await request(app).get('/v1/api/blog/fetch');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/no blogs available/i);
  });

  it('should filter blogs by title', async () => {
    const testUser = await user.create({
      email: 'filter@example.com',
      firstName: 'Filter',
      lastName: 'Test',
      password: 'test1234'
    });

    await blog.create([
      {
        userId: testUser._id,
        title: 'Learn Node.js',
        description: 'A blog about Node.js',
        author: 'Node Guru',
        body: 'Lots of info here...',
        tags: ['node'],
        fandom: 'backend'
      },
      {
        userId: testUser._id,
        title: 'Learn React',
        description: 'A blog about React.js',
        author: 'React Dev',
        body: 'React stuff...',
        tags: ['react'],
        fandom: 'frontend'
      }
    ]);

    const res = await request(app).get('/v1/api/blog/fetch?title=React');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0]).toHaveProperty('title', 'Learn React');
  });
});
