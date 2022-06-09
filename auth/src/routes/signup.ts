import express,{Request,Response} from 'express';
import {body,validationResult} from 'express-validator'
import {RequestValidationError} from '../errors/request-validation-error'
import { User } from '../models/user';
import { BadRequestError } from './../errors/bad-request-error';
import 'express-async-errors' 
import {Password} from '../services/password'       

const router = express.Router()

router.post('/api/users/signup',
[   //validation of body
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min:4,max:20}).withMessage('Password must be 4-20 characters')
],
async (req:Request,res:Response)=>{

    const errors = validationResult(req)    //fetch errors if any during validation of body as mentioned above

    if(!errors.isEmpty())
    {
        throw new RequestValidationError(errors.array())
    }

    const {email,password} = req.body

    const existingUser = await User.findOne({email})
    
    if(existingUser)
    {
        console.log('User exists with provided email')
        throw new BadRequestError('User exists with provided email')
    }
    
    const newUser = User.build({email,password})
    await newUser.save()
    console.log('User created')

    res.status(201).send(newUser)
})

export {router as signupRouter}