import express ,{ Request,Response } from 'express';
import {requireAuth} from 'ticket-app-microservices-common'
import {body} from 'express-validator';
import { validateRequest } from 'ticket-app-microservices-common';
import { Ticket } from '../models/tickets'

const router  = express.Router()

router.post('/api/tickets',requireAuth,
[body('title').not().isEmpty().withMessage('Title is required'),
 body('price').isFloat({gt:0}).withMessage('PRice must be greater than zero')]
,validateRequest
,async (req : Request,res : Response)=>{
    const {title,price} =req.body

    const ticket = Ticket.build({
        title,price,userId:req.currentUser!.id
    })

    await ticket.save()
    console.log(`Ticket created`)
    res.status(201).send(ticket)
})

export {router as createTicketRouter}