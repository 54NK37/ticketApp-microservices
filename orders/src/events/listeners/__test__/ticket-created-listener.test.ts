import { TicketCreatedEvent } from "ticket-app-microservices-common"
import { natsWrapper } from "../../../nats/nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
    // create an instance of listener
    const listener = new TicketCreatedListener(natsWrapper.client)

    // create a fake event data
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it('Creates and saves a ticket in on receiving a ticket:created event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeDefined()
    expect(ticket?.title).toEqual(data.title)
    expect(ticket?.price).toEqual(data.price)
})

it('Acks the message on receiving a ticket:created event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})