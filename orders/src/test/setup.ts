import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// signin will be available only in test environment and not dev env
declare global {
  var signin: () => { cookie: string[] };
}

jest.mock("../nats-wrapper");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  mongo = new MongoMemoryServer(); // in memory mongo server.no need of separate db locally
  await mongo.start();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  jest.setTimeout(60000)

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// like other clients cookie is not stored with supertest.To avoid repitive retriving cookie
global.signin = () => {
  // we dont want to depend on auth service so we create jwt again and replicate
  // it as required for cookie-session
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: "test3@test.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const jwtObject = { jwt: token };

  const jsonString = JSON.stringify(jwtObject);

  const jsonStringB64 = Buffer.from(jsonString).toString("base64");

  return { cookie: [`session=${jsonStringB64}`] };
};
