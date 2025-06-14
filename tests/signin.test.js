// tests/signin.test.js
import request from 'supertest';
import { app } from '../app.js';
import * as mockingoose from 'mockingoose';
import user from '../models/userModel.js';
import bcrypt from 'bcrypt';

describe('POST /v1/auth/signin', () => {
  const testPassword = 'Notebook';
  const testUserEmail = 'yagami@gmail.com';

  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return 200 and log in user with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Create a real instance of the Mongoose model
    const mockedUser = new user({
      _id: '1',
      email: testUserEmail,
      name: 'Light Yagami',
      firstName: 'Light',
      lastName: 'Yagami',
      password: hashedPassword,
      refreshTokens: [],
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 🛠️ Stub the .save() method
    mockedUser.save = jest.fn().mockResolvedValue(mockedUser);

    // Return that instance when `findOne` is called
    mockingoose(user).toReturn(mockedUser, 'findOne');

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
    mockingoose(user).toReturn(null, 'findOne');

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
    const wrongHashed = await bcrypt.hash('wrongPassword', 10);

    mockingoose(user).toReturn({
      email: testUserEmail,
      password: wrongHashed,
    }, 'findOne');

    const res = await request(app)
      .post('/v1/auth/signin')
      .send({
        email: testUserEmail,
        password: testPassword, // actual correct one, but mocked user has different hash
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
