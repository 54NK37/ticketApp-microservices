import { TicketUpdatedEvent } from "ticket-app-microservices-common"
import { natsWrapper } from "../../../nats/nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { TicketUpdatedListener } from "../ticket-updated-listener"

const setup = async () => {
    // create an instance of listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    });

    await ticket.save()

    // create a fake event data
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'concert 2',
        price: 100,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket }
}

it('Finds, Updates and Saves a ticket in on receiving a ticket:updated event', async () => {
    const { listener, data, msg, ticket } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket).toBeDefined()
    expect(updatedTicket?.title).toEqual(data.title)
    expect(updatedTicket?.price).toEqual(data.price)
    expect(updatedTicket?.version).toEqual(data.version)
})

it('Acks the message on receiving a ticket:created event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})

it('Does not Acks the message on receiving a in order version event', async () => {
    const { listener, data, msg } = await setup();
    data.version = 10;
    try {
        await listener.onMessage(data, msg);        
    } catch (error) {
    }
    expect(msg.ack).not.toHaveBeenCalled();
})