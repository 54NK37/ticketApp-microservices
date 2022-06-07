import express from "express";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import {errorHandler} from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error';
import 'express-async-errors'   //async function callback can make fail our all throwed errors inside routes
const app = express()
app.use(express.json())

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

// for all http methods .
app.all('*',async ()=>{
    throw new NotFoundError()
})

app.use(errorHandler)

app.listen(3000,()=>{
    console.log('Listening on 3000!!')
})