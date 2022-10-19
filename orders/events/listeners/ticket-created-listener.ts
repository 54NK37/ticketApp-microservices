import { Listener, Subjects } from "ticket-app-microservices-common";
import { TicketCreatedEvent } from 'ticket-app-microservices-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../src/models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{

    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data:TicketCreatedEvent['data'],msg : Message){
        const {id,title,price} = data;

        // storing ticket inside local colletion of orders srv
        const ticket = Ticket.build({
            id,title,price
        })

        await ticket.save()

        msg.ack()
    }
}