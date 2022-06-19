import request from 'supertest'
import {app} from '../../app'
import { currentUser } from './../../middlewares/current-user';

it('Returns current user',async ()=>{
    //    like other clients cookie is not stored with supertest.Hence we set it explicitly
        const {cookie} = await global.signin()
        const response = await request(app)
           .get('/api/users/currentuser')
           .set('Cookie' , cookie)
           .expect(200)

        expect(response.body.currentUser.email).toEqual('test3@test.com')
})

it('Returns current user as null if not signed in',async ()=>{
        const response = await request(app)
           .get('/api/users/currentuser')
           .expect(200)

        expect(response.body.currentUser).toEqual(null)
})
