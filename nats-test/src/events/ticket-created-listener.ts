import { Message } from 'node-nats-streaming';
import {Listener} from 'ticket-app-microservices-common/build/events/base-listener'
import { Subjects } from 'ticket-app-microservices-common/build/events/subjects';
import { TicketCreatedEvent } from 'ticket-app-microservices-common/build/events/ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated
    queueGroupName = 'payments-service'
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event Data : ',data)
        msg.ack()
    }
  }
  