import { Subjects, Publisher, TicketCreatedEvent } from 'ticket-app-microservices-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
