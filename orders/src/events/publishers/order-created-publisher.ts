import { Subjects } from "ticket-app-microservices-common/build/events/subjects";
import { OrderCreatedEvent } from "ticket-app-microservices-common/build/events/order-created-event";
import { Publisher } from "ticket-app-microservices-common/build/events/base-publisher";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
