import { Listener, Subjects, TicketUpdatedEvent } from "ticket-app-microservices-common";
import { Message } from 'node-nats-streaming';
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../src/models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{

    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data:TicketUpdatedEvent['data'],msg : Message){
        const {id,title,price} = data;

        const ticket = await Ticket.findById(id)

        if(!ticket)
        {
            throw new Error('Ticket not found')
        }

        ticket.set({title,price})

        await ticket.save() 

        msg.ack()
    }
}