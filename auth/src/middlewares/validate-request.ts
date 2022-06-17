import express,{Request,Response,NextFunction} from 'express'
import {validationResult} from 'express-validator'
import { RequestValidationError } from './../errors/request-validation-error';

// middleware to validate as per express-validator rules
export const validateRequest = (req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req)    //fetch errors if any during validation of body as mentioned above

    if(!errors.isEmpty())
    {
        throw new RequestValidationError(errors.array())
    }

    next()
}