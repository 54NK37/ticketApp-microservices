import {app} from "./app";
import mongoose from "mongoose";

const start = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log('Connected to monogodb')
    } catch (error) {
        console.log(error)
    }
}

app.listen(3000,async ()=>{
    if(!process.env.JWT_KEY || !process.env.MONGO_URI)        // here we have to ckeck all env files are loaded properly
        throw new Error('Environment variables not defined')
    await start()
    console.log('Listening on 3000!!')
})