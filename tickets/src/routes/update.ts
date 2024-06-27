import express ,{ Request,Response } from 'express';
import {BadRequestError, requireAuth} from 'ticket-app-microservices-common'
import {body} from 'express-validator';
import { validateRequest } from 'ticket-app-microservices-common';
import { Ticket } from '../models/tickets'
import { NotFoundError } from 'ticket-app-microservices-common/build/errors/not-found-error';
import { NotAuthorizedError } from 'ticket-app-microservices-common/build/errors/not-authorized-error';
import { natsWrapper } from '../nats/nats-wrapper';
import { TicketUpdatedPublisher } from './../events/publishers/ticket-updated-publisher';

const router  = express.Router()

router.put('/api/tickets/:id',requireAuth,
[body('title').not().isEmpty().withMessage('Title is required'),
 body('price').isFloat({gt:0}).withMessage('Price must be greater than zero')]
,validateRequest
,async (req : Request,res : Response)=>{
    const {title,price} =req.body
    const id = req.params.id
    const ticket = await Ticket.findById(id)
    if(!ticket)
    {
        throw new NotFoundError()
    }
    if(ticket.userId !== req.currentUser!.id)
    {
        throw new NotAuthorizedError()
    }
    if(ticket.orderId)
    {
        throw new BadRequestError('Cannot edit a reserved ticket')
    }

    ticket.set({
        title,
        price
    })
    await ticket.save()
    console.log(`Ticket updated`)
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id : ticket.id,
        version: ticket.version,
        title : ticket.title,
        price : ticket.price,
        userId : ticket.userId,
    })
    res.status(200).send(ticket)
})

export {router as updateTicketRouter}