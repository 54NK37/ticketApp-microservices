import { OrderCreatedEvent, OrderStatus } from "ticket-app-microservices-common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats/nats-wrapper"
import { Order } from "../../../models/order"

const setup = async () => {
    // create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    // create a fake event data
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'sefeadf',
        expiresAt: 'sefeadf',
        ticket: {
            id: 'sdfsdfsd',
            price: 10,
        }
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it('It replicates an order through order:created event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const orderDb = await Order.findById(data.id)
    expect(orderDb!.price).toEqual(data.ticket.price)
})

it('Acks the message on receiving a order:created event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})