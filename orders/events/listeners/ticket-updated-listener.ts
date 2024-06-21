import { Listener, Subjects, TicketUpdatedEvent } from "ticket-app-microservices-common";
import { Message } from 'node-nats-streaming';
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../src/models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {

    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price, version } = data;

        const ticket = await Ticket.findByEvent(data)

        if (!ticket) {
            throw new Error('Ticket not found')
        }

        ticket.set({ title, price })

        // without plugin : Same version as updated
        // ticket.set({ title, price, version })

        await ticket.save()

        msg.ack()
    }
}