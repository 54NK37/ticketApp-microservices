import {Request,Response,NextFunction} from "express"
import { CustomError } from "../errors/custom-error"

// middleware to catch all throwed error object.1st error parameter.
export const errorHandler = (err:Error,req:Request,res:Response,next:NextFunction)=>{

// creating abstract class to have single if check and also common response structure
    if(err instanceof CustomError)
    {
        return res.status(err.statusCode).send({errors : err.serializeErrors()})
    }
    console.error(err)
    res.status(500).send({
        errors : [{message:err.message}]
    })
} 