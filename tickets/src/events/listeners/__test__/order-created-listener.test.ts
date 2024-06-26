import { OrderCreatedEvent, OrderStatus, TicketCreatedEvent } from "ticket-app-microservices-common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats/nats-wrapper"
import { Ticket } from "../../../models/tickets"

const setup = async () => {
    // create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'sefeadf'
    })

    await ticket.save()

    // create a fake event data
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'sefeadf',
        expiresAt: 'sefeadf',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}

it('Creates and reserves a ticket in on receiving a order:created event', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const ticketDb = await Ticket.findById(ticket.id)
    expect(ticketDb!.orderId).toEqual(data.id)
})

it('Acks the message on receiving a ticket:created event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})