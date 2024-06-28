import { Listener, OrderCreatedEvent, Subjects } from "ticket-app-microservices-common"
import { queueGroupName } from './queue-group-name'
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log(`Waiting for ${delay} ms to process orderId ${data.id}`)
        await expirationQueue.add({ orderId: data.id }, { delay })
        msg.ack()
    }
}