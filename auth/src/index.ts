import {app} from "./app";
import mongoose from "mongoose";

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