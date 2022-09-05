import { Subjects } from "ticket-app-microservices-common/build/events/subjects";
import { Publisher } from "ticket-app-microservices-common/build/events/base-publisher";
import { TicketUpdatedEvent } from 'ticket-app-microservices-common/build/events/ticket-updated-event';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
