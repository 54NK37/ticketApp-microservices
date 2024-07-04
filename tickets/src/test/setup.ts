import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import  jwt from 'jsonwebtoken';

// signin will be available only in test environment and not dev env
declare global {
    var signin : ()=>{cookie : string[]}
  }

// like other clients cookie is not stored with supertest.To avoid repitive retriving cookie
global.signin = ()=>{
    // we dont want to depend on auth service so we create jwt again and replicate 
    // it as required for cookie-session
    const id = new mongoose.Types.ObjectId().toHexString()
    const payload = {
        id,
        email : "test3@test.com"
    }

    const token = jwt.sign(payload,process.env.JWT_KEY!)
    
    const jwtObject = {jwt : token}

    const jsonString = JSON.stringify(jwtObject)

    const jsonStringB64 = Buffer.from(jsonString).toString('base64')

    return {cookie : [`session=${jsonStringB64}`]}
}

// it will use mock for this file
jest.mock('../nats-wrapper')

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
    jest.clearAllMocks()
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