import { Listener, OrderCreatedEvent, Subjects } from "ticket-app-microservices-common"
import { queueGroupName } from './queue-group-name'
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        // orders collection inside payments service.
        // pull only necessary fields and use status instead of expiresAt
        const order = Order.build({
            id: data.id,
            userId: data.userId,
            status: data.status,
            price: data.ticket.price,
            version: data.version
        })

        await order.save()
        msg.ack()
    }
}