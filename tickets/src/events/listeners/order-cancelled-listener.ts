import { Listener, OrderCancelledEvent, Subjects } from "ticket-app-microservices-common"
import { queueGroupName } from './queue-group-name'
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // Mark ticket as unreserved thorugh orderId and publish TicketUpdated event
        const { id, ticket } = data;
        const ticketDb = await Ticket.findById(ticket.id)

        if (!ticketDb) {
            throw new Error('Ticket not found')
        }

        ticketDb.set({ orderId: undefined });
        await ticketDb.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticketDb.id,
            price: ticketDb.price,
            title: ticketDb.title,
            userId: ticketDb.userId,
            orderId: ticketDb.orderId,
            version: ticketDb.version
        })
        msg.ack()
    }
}