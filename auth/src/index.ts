import express from "express";
import cookieSession from 'cookie-session'
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import {errorHandler} from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error';
import 'express-async-errors'   //async function callback can make fail our all throwed errors inside routes
import mongoose from "mongoose";

const app = express()
app.set('trust proxy',true)     //trust proxy provided by ingress
app.use(express.json())
app.use(cookieSession({         //for https
    signed:false,
    secure:true
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

const start = async()=>{
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
        console.log('Connected to monogodb')
    } catch (error) {
        console.log(error)
    }
}

app.listen(3000,async ()=>{
    if(!process.env.JWT_KEY)        // here we have to ckeck all env files are loaded properly
        throw new Error('JWT_KEY is not defined')
    await start()
    console.log('Listening on 3000!!')
})