import { Subjects, Publisher, ExpirationCompleteEvent } from 'ticket-app-microservices-common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}