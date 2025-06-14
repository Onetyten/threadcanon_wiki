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

beforeEach(async () => {
  await user.create({
    email: 'yagami@gmail.com',
    firstName: 'Light',
    lastName: 'Yagami',
    password: '$2b$10$nN2y8MxQpD2/NoDWqXXAFeTYvXcg/Dq0gYJfcxfoiptMFQwDMEu4u', 
  });
});


afterEach(async () => {
  await user.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});



describe('POST /v1/auth/signin', () => {

    // check if the endpoint is working as intended
  it('should return 200 and log in users', async () => {

    const res = await request(app)
      .post('/v1/auth/signin')
      .send({
        email: 'yagami@gmail.com',
        password: 'Notebook'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data')
    expect(res.body.success).toBe(true)
    expect(res.body.data.email).toBe('yagami@gmail.com');
  });

//   it('should return 400 if essential data is missing', async () => {
//     const res = await request(app)
//       .post('/v1/auth/signin')
//       .send({ email: '', password: 'deathnote123' });

//     expect(res.statusCode).toBe(400);
//     expect(res.body.success).toBe(false)
//   });

});
