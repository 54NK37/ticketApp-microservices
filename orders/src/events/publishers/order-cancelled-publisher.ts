import { Subjects, Publisher, OrderCancelledEvent } from 'ticket-app-microservices-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
