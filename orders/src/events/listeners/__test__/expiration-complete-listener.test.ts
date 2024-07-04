import { ExpirationCompleteEvent, OrderStatus, TicketCreatedEvent } from "ticket-app-microservices-common"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { Order } from "../../../models/order"

const setup = async () => {
    // create an instance of listener
    const listener = new ExpirationCompleteListener(natsWrapper.client)

    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    });

    await ticket.save()

    // create and save a order
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'sdasda',
        expiresAt: new Date(),
        ticket
    });

    await order.save()

    // create a fake event data
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, order, data, msg }
}

it('Updates the order status to cancelled', async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
})

it('Emit an OrderCancelled event', async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(eventData.id).toEqual(order.id)
})

it('Acks the message on receiving a expiration:complete event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})