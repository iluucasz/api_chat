import request from 'supertest';
import { app } from '../../app';
import { generateDynamicUser } from '../mock/user.mock';
import { generateAuthentication } from '../utils/generateToken';
const connection = require('../../db/');
// @ts-ignore
const truncate = require('../utils/truncate.js');

beforeEach(async () => {
   await truncate(connection.models);
});

describe('Unit Test: Update user', () => {
   it('Should be able to update a user successfully', async () => {
      const { user, token } = await generateAuthentication();

      const updatedUser = generateDynamicUser();

      const responseUpdate = await request(app)
         .patch(`/users/${user.dataValues.id}`)
         .set('Authorization', `Bearer ${token}`)
         .send(updatedUser)
         .expect(200);

      expect(responseUpdate.body).toHaveProperty('id');
      expect(responseUpdate.body.firstName).toBe(updatedUser.firstName);
      expect(responseUpdate.body.lastName).toBe(updatedUser.lastName);
      expect(responseUpdate.body.email).toBe(updatedUser.email);
   });

   it('Should return 401 if authentication token is missing', async () => {
      const updatedUser = generateDynamicUser();

      const responseUpdate = await request(app)
         .patch(`/users/123`) // ID válido
         .send(updatedUser)
         .expect(401);

      expect(responseUpdate.body).toEqual({ message: 'Token is required' });
   });

   it('Should return 401 if authentication token is missing', async () => {
      const updatedUser = generateDynamicUser();

      const responseUpdate = await request(app)
         .patch(`/users/123`) // ID válido
         .send(updatedUser)
         .expect(401);

      expect(responseUpdate.body).toEqual({ message: 'Token is required' });
   });
});
