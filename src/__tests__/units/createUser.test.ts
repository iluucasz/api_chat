// createUser.test.ts
import request from 'supertest';
import { app } from '../../app';
import { generateDynamicUser, createUserReturn } from '../mock/user.mock'; // Importe o createUserReturn
const connection = require('../../db/');
// @ts-ignore
const truncate = require('../utils/truncate.js');

beforeEach(async () => {
   await truncate(connection.models);
});

describe('Unit Test: Create user', () => {
   it('Should be able to create a user successfully', async () => {
      const user = generateDynamicUser();
      const response = await request(app).post('/users/register').send(user);
      const { email, createdAt, id } = response.body;

      const newUser = { ...createUserReturn, id, email, createdAt };

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newUser);
   });

   it('Should not be able to register a user with the same email', async () => {
      const user = generateDynamicUser();
      await request(app).post('/users/register').send(user).expect(201);

      const response = await request(app).post('/users/register').send(user).expect(403);

      expect(response.body).toEqual({ message: 'E-mail already registered' });
   });
});
