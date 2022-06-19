import request from 'supertest'
import {app} from '../../app'

it('Returns 201 for successful signin',async ()=>{
    await request(app)
           .post('/api/users/signup')
           .send({
            "email" : "test3@test.com",
            "password" : "password"
           })
           .expect(201)

    await request(app)
           .post('/api/users/signin')
           .send({
            "email" : "test3@test.com",
            "password" : "password"
           })
           .expect(200)
})