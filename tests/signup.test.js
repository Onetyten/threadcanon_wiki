import request from 'supertest';
import {app} from '../app.js';
import mongoose from 'mongoose';
import user from '../models/userModel.js';
import dotenv from 'dotenv'

dotenv.config({path:'../.env.test'})


beforeAll(async () => {
  await mongoose.connect(process.env.DB, {
    useNewUrlParser: true,

  });
});

afterEach(async () => {
  await user.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});



describe('POST /v1/auth/signup', () => {

    // check if the endpoint is working as intended
  it('should return 201 and create a new user', async () => {

    const res = await request(app)
      .post('/v1/auth/signup')
      .send({
        email: 'yagami@gmail.com',
        firstName: 'Light',
        lastName: 'Yagami',
        password: 'deathnote123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('data')
    expect(res.body.success).toBe(true)
    expect(res.body.data.email).toBe('yagami@gmail.com');
  });



  it('should return 400 if essential data is missing', async () => {
    const res = await request(app)
      .post('/v1/auth/signup')
      .send({
        email: '',
        firstName: 'Light',
        lastName: 'Yagami',
        password: 'deathnote123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false)
  });

});
