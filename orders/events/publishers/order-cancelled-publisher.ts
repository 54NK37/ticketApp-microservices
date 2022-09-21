import { Subjects } from "ticket-app-microservices-common/build/events/subjects";
import { Publisher } from "ticket-app-microservices-common/build/events/base-publisher";
import { OrderCancelledEvent } from 'ticket-app-microservices-common/build/events/order-cancelled-event';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
