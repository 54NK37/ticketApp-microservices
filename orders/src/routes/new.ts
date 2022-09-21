import express, { Request, Response } from "express";
import { BadRequestError, NotFoundError, requireAuth, validateRequest } from "ticket-app-microservices-common";
import { Order,OrderStatus } from "../models/order";
import { body } from 'express-validator';
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post("/api/orders",requireAuth,
[body('ticketId').not().isEmpty().custom((input : string)=>mongoose.Types.ObjectId.isValid(input)).withMessage('TicketID is required as mongodbId')]
,validateRequest, async (req: Request, res: Response) => {
  
  const {ticketId} = req.body

  // find the ticket which user is trying to reserve with order
  const ticket = await Ticket.findById(ticketId);
  
  if(!ticket) throw new NotFoundError()

  // make sure it is not reserved
  // ticket does'nt belong to any order OR it belongs to an order with status!=cancelled
  const isReserved = await ticket.isReserved()

  if(isReserved) throw new BadRequestError('Ticket already reserved')

  // expiration date for this order
  const expiration  =  new Date()
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

  const newOrder = {
      userId : req.currentUser!.id,
      status : OrderStatus.Created,
      expiresAt :expiration,
      ticket
  }
  const order = Order.build(newOrder)
  await order.save()
  
  // publish an event of order created
  
  res.status(201).send(order);
});

export { router as createOrderRouter };
