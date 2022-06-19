import request from 'supertest'
import {app} from '../../app'

it('Returns 201 for successful signup',async ()=>{
    await request(app)
           .post('/api/users/signup')
           .send({
            "email" : "test3@test.com",
            "password" : "password"
           })
           .expect(201)
})

it('Returns 400 with Invalid email',async ()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
     "email" : "test3test.com",
     "password" : "password"
    })
    .expect(400)
})

it('Returns 400 with Invalid password',async ()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
     "email" : "test3@test.com",
     "password" : "pas"
    })
    .expect(400)
})

it('Returns 400 with missing email & password',async ()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
     "email" : "test3@test.com"
    })
    .expect(400)

    await request(app)
    .post('/api/users/signup')
    .send({
     "email" : ""
    })
    .expect(400)
})

it('Returns 400 with Duplicate email',async ()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
     "email" : "test3@test.com",
     "password" : "password"
    })
    .expect(201)

    await request(app)
    .post('/api/users/signup')
    .send({
     "email" : "test3@test.com",
     "password" : "password"
    })
    .expect(400)
})

it('Sets cookie after successful signup',async ()=>{
    const response = await request(app)
           .post('/api/users/signup')
           .send({
            "email" : "test3@test.com",
            "password" : "password"
           })
           .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
    
})