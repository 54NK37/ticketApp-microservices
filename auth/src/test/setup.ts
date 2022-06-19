import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import {app} from '../app'
import  request  from 'supertest';

// signin will be available only in test environment and not dev env
declare global {
    var signin : ()=>Promise<{'cookie' : string[]}>
  }

// like other clients cookie is not stored with supertest.To avoid repitive retriving cookie
global.signin = async ()=>{
    const email = "test3@test.com"
    const password = "password"

    let response = await request(app)
    .post('/api/users/signup')
    .send({email,password})
    .expect(201)

    const cookie = response.get('Set-Cookie')

    return {cookie}
}

let mongo:any

// hook which run once before tests
beforeAll(async ()=>{
    process.env.JWT_KEY = "sanket"

    mongo = new MongoMemoryServer()   // in memory mongo server.no need of separate db locally
    await mongo.start()
    const mongoUri = await mongo.getUri()
    await mongoose.connect(mongoUri)
})

// hook which run before each test
beforeEach(async ()=>{
    const collections = await mongoose.connection.db.collections()
    collections.forEach(async(collection)=>{
        await collection.deleteMany({})     //empty collections
    })
})

// hook which run once after tests
afterAll(async ()=>{
    await mongo.stop()
    await mongoose.connection.close()
})