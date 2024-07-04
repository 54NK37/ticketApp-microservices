import { Subjects, Publisher, TicketUpdatedEvent } from 'ticket-app-microservices-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
