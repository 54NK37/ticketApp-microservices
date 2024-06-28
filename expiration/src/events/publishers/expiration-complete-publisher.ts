import { Subjects } from "ticket-app-microservices-common";
import { ExpirationCompleteEvent } from "ticket-app-microservices-common";
import { Publisher } from "ticket-app-microservices-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
