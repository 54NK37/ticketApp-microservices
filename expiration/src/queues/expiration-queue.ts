import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { natsWrapper } from '../nats/nats-wrapper'

interface Payload {
    orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

// redis server sends job to be processed
expirationQueue.process(async (job) => {
    const { data: payload } = job
    new ExpirationCompletePublisher(natsWrapper.client).publish(payload)
})

export { expirationQueue }