import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus, TicketCreatedEvent } from "ticket-app-microservices-common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/tickets"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup = async () => {
    // create an instance of listener
    const listener = new OrderCancelledListener(natsWrapper.client)
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'sefeadf',
    })
    ticket.set({ orderId })
    await ticket.save()

    // create a fake event data
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg, orderId }
}

it('Un  reserves a ticket in on receiving a order:cancelled event', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const ticketDb = await Ticket.findById(ticket.id)
    expect(ticketDb!.orderId).not.toBeDefined()
})

it('Acks the message on receiving a order:cancelled event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})

it('Published ticket:updated event on receiving an order:created event', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    expect(msg.ack).toHaveBeenCalled();
    const ticketUpdatedata = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(ticketUpdatedata!.orderId).not.toBeDefined()
})

