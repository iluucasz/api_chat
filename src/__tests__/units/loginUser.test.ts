import request from 'supertest';
import { app } from '../../app';
import { generateDynamicUser } from '../mock/user.mock';
const connection = require('../../db/');
// @ts-ignore
const truncate = require('../utils/truncate.js');

beforeEach(async () => {
   await truncate(connection.models);
});

describe('Unit Test: Login user', () => {
   it('Should be able to login a user successfully', async () => {
      const user = generateDynamicUser();
      await request(app).post('/users/register').send(user).expect(201);

      const response = await request(app)
         .post('/users/login')
         .send({ email: user.email, password: user.password })
         .expect(200);

      expect(response.body).toHaveProperty('token');
   });

   it('Should not be able to login with invalid credentials', async () => {
      const user = generateDynamicUser();
      await request(app).post('/users/register').send(user).expect(201);

      const response = await request(app)
         .post('/users/login')
         .send({ email: user.email, password: 'wrongPassword' })
         .expect(401);

      expect(response.body).toEqual({ message: 'Invalid password' });
   });

   it('Should not be able to login with non-existing user', async () => {
      const response = await request(app)
         .post('/users/login')
         .send({ email: 'nonexistinguser@example.com', password: 'password' })
         .expect(404);

      expect(response.body).toEqual({ message: 'User not found' });
   });
});
