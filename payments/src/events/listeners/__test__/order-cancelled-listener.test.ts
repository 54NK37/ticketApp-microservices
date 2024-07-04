import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus, TicketCreatedEvent } from "ticket-app-microservices-common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { Order } from "../../../models/order"

const setup = async () => {
    // create an instance of listener
    const listener = new OrderCancelledListener(natsWrapper.client)
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id : orderId,
        status : OrderStatus.Created,
        price: 10,
        userId: 'EASDFRSD',
        version: 0
    })

    await order.save()

    // create a fake event data
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 1,
        ticket: {
            id: 'sdzfsdf'
        }
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, data, msg, orderId }
}

it('Updates the status of order on receiving a order:cancelled event', async () => {
    const { listener, data, msg, orderId } = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(orderId)
    expect(order!.status).toEqual(OrderStatus.Cancelled)
})

it('Acks the message on receiving a order:cancelled event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})

