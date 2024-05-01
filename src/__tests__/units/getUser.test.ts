import request from 'supertest';
import { app } from '../../app';
import { generateAuthentication } from '../utils/generateToken';
const connection = require('../../db/');
// @ts-ignore
const truncate = require('../utils/truncate.js');

beforeEach(async () => {
   await truncate(connection.models);
});

describe('Unit Test: Show all Users', () => {
   it('Should be able to show all users', async () => {
      const { token } = await generateAuthentication();

      const response = await request(app).get('/users').set('Authorization', `Bearer ${token}`).expect(200);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
   });

   it('should throw error when there is no token', async () => {
      await request(app).get('/users').expect(401);
   });

   it('should throw error when the token is invalid', async () => {
      const token = '1234';
      await request(app).get('/users').set('Authorization', `Bearer ${token}`).expect(401);
   });
});
