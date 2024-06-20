import express, { Request, Response } from "express";
import { NotFoundError, requireAuth,NotAuthorizedError } from "ticket-app-microservices-common";
import { OrderCancelledPublisher } from "../../events/publishers/order-cancelled-publisher";
import { Order,OrderStatus } from "../models/order";
import { natsWrapper } from "../nats/nats-wrapper";

const router = express.Router();

router.delete("/api/orders/:orderId",requireAuth, async (req: Request, res: Response) => {
  const {orderId} = req.params
  
  let order = await Order.findById(orderId).populate('ticket');
  if(!order) throw new NotFoundError()
  if(order.userId != req.currentUser!.id) throw new NotAuthorizedError()

  order.status = OrderStatus.Cancelled
  await order.save()

  // publish an event of order cancelled
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id : order.id,
    version: order.version,
    ticket : {
      id : order.ticket.id
    }
  })

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
