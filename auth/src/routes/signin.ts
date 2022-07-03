import express, { Request, Response } from 'express';
import { body } from 'express-validator'
import 'express-async-errors'
import { User } from '../models/user';
import { validateRequest,BadRequestError } from 'ticket-app-microservices-common';
import { Password } from './../services/password';
import { generateJwt } from '../services/generate-jwt';

const router = express.Router()

router.post('/api/users/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('Password could not be empty')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body
        
        const existingUser = await User.findOne({ email })
        
        if (!existingUser) {
            throw new BadRequestError('Invalid Credentials')
        }

        const authenticated = await Password.compare(existingUser.password, password)

        if(!authenticated)
        {
            throw new BadRequestError('Invalid Credentials')
        }

        req.session = generateJwt(existingUser)

        res.status(200).send(existingUser)
    })

export { router as signinRouter }