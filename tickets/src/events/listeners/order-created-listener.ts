import { Listener, NotFoundError, OrderCreatedEvent, OrderStatus, Subjects } from "ticket-app-microservices-common"
import { queueGroupName } from './queue-group-name'
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // Mark ticket as reserved thorugh orderId
        const { id, ticket } = data;
        const ticketDb = await Ticket.findById(ticket.id)

        if (!ticketDb) {
            throw new Error('Ticket not found')
        }

        ticketDb.set({ orderId: id });
        await ticketDb.save()
        msg.ack()
    }
}