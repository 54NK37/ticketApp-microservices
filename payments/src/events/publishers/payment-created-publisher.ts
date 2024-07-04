import { Publisher, Subjects, PaymentCreatedEvent } from "ticket-app-microservices-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
