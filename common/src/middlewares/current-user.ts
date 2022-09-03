import { NextFunction, Response,Request } from "express";
import jwt from "jsonwebtoken";

interface Userpayload{
    id:string,
    email:string
}

declare global{
    namespace Express
    {
        // adding custom data type to request object
        interface Request{
            currentUser? : Userpayload
        }
    }
}

// middleware to retrieve token from cookies of each request and check if currentUser is logged in
export const currentUser = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.session ? req.session.jwt : null
    if(!token)
    {
        return next()
    }

    try {
        const user = jwt.verify(token,process.env.JWT_KEY!) as Userpayload
        req.currentUser  = user
    } catch (error) {}
    
    next()
}