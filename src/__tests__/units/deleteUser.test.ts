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

describe('Unit Test: Delete user', () => {
   it('Should be able to delete a user successfully', async () => {
      const initialUser = generateDynamicUser();
      const { user, token } = await generateAuthentication(initialUser);

      const userId = user.dataValues.id;

      const responseDelete = await request(app)
         .delete(`/users/${userId}`)
         .set('Authorization', `Bearer ${token}`)
         .expect(204);
   });

   it('Should return 401 if authentication token is missing', async () => {
      const initialUser = generateDynamicUser();
      const { user } = await generateAuthentication(initialUser);

      const userId = user.dataValues.id;

      await request(app).delete(`/users/${userId}`).expect(401);
   });

   it('Should return 404 if user ID is not found', async () => {
      const initialUser = generateDynamicUser();
      const { user, token } = await generateAuthentication(initialUser);

      await request(app).delete('/users/9999').set('Authorization', `Bearer ${token}`).expect(404);
   });
});
