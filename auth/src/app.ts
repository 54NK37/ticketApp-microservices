import express from "express";
import cookieSession from 'cookie-session'
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import {errorHandler} from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error';
import 'express-async-errors'   //async function callback can make fail our all throwed errors inside routes

// app is written separately for testing as we require only app without running on any port
const app = express()
app.set('trust proxy',true)     //trust proxy provided by ingress
app.use(express.json())
app.use(cookieSession({         //for https
    signed:false,
    secure:process.env.NODE_ENV !== 'test'  //supertest sends only http requests
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

// for all http methods .
app.all('*',async ()=>{
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}