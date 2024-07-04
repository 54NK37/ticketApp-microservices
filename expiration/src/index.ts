import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    try {
        if (!process.env.NATS_CLUSTER_ID || !process.env.NATS_URL || !process.env.CLIENT_ID || !process.env.REDIS_HOST) {// here we have to ckeck all env files are loaded properly
            console.log(process.env.JWT_KEY, process.env.MONGO_URI, process.env.NATS_CLUSTER_ID, process.env.NATS_URL, process.env.CLIENT_ID)
            throw new Error('Environment variables not defined')
        }

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.CLIENT_ID!, process.env.NATS_URL!)

        new OrderCreatedListener(natsWrapper.client).listen()
        
        // handling closing at here because process.exit should be avoided in singleton class 
        // refer nats-test for more details
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())
        console.log('Started Expiration service!!!')
    } catch (error) {
        console.log(error)
    }
}

start()