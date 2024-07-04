import { Subjects, Publisher, OrderCreatedEvent } from 'ticket-app-microservices-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
