import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });


import request from 'supertest';
import { app } from '../app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import userModel from '../models/userModel.js';
import blogModel from '../models/blogModel.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await userModel.deleteMany({});
  await blogModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /v1/api/blog/publish/:blogId', () => {
  let token;
  let blogId;

  it('should publish a blog when user is authenticated and blog exists', async () => {
    const signupRes = await request(app).post('/v1/auth/signup').send({
      email: 'yagami@gmail.com',
      firstName: 'Light',
      lastName: 'Yagami',
      password: 'deathnote123',
    });

    const signinRes = await request(app).post('/v1/auth/signin').send({
      email: 'yagami@gmail.com',
      password: 'deathnote123',
    });

    token = signinRes.body.token;
    expect(token).toBeDefined();

    const blogRes = await request(app)
      .post('/v1/api/blog/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Death Note Power',
        description: 'How Light uses the Death Note',
        body: 'A compelling breakdown of justice and power...',
        tags: ['anime', 'psychological'],
        author: 'Light Yagami',
      });

    expect(blogRes.body.success).toBe(true);
    blogId = blogRes.body.data?._id;

    const publishRes = await request(app)
      .get(`/v1/api/blog/publish/${blogId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(publishRes.statusCode).toBe(200);
    expect(publishRes.body.success).toBe(true);
    expect(publishRes.body.data.state).toBe('published');

    const updatedBlog = await blogModel.findById(blogId);
    expect(updatedBlog.state).toBe('published');
  });

  it('should fail if blog does not exist', async () => {
    await request(app).post('/v1/auth/signup').send({
      email: 'test@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123',
    });

    const signinRes = await request(app).post('/v1/auth/signin').send({
      email: 'test@gmail.com',
      password: 'password123',
    });

    token = signinRes.body.token;
    expect(token).toBeDefined();

    const fakeBlogId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/v1/api/blog/publish/${fakeBlogId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('blog not found');
  });
});
