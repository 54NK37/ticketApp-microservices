import express, { Request, Response } from 'express';
import { body } from 'express-validator'
import { User } from '../models/user';
import { validateRequest,BadRequestError } from 'ticket-app-microservices-common';
import 'express-async-errors'
import { generateJwt } from '../services/generate-jwt';

const router = express.Router()

router.post('/api/users/signup',
    [   //validation of body
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be 4-20 characters')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            console.log('User exists with provided email')
            throw new BadRequestError('User exists with provided email')
        }

        const newUser = User.build({ email, password })
        await newUser.save()

        // store jwt on cookie session created by cookieSession
        req.session = generateJwt(newUser)

        console.log('User created')

        //object is converted to json string.Here model tranform is called
        res.status(201).send(newUser)
    })

export { router as signupRouter }