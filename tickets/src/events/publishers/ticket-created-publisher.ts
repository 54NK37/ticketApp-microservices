import { Subjects } from "ticket-app-microservices-common/build/events/subjects";
import { TicketCreatedEvent } from "ticket-app-microservices-common/build/events/ticket-created-event";
import { Publisher } from "ticket-app-microservices-common/build/events/base-publisher";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
