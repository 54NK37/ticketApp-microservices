import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log('Connected to MonogoDb')

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.CLIENT_ID!, process.env.NATS_URL!)

        // Listening for events from tickets service
        new TicketCreatedListener(natsWrapper.client).listen()
        new TicketUpdatedListener(natsWrapper.client).listen()
        new ExpirationCompleteListener(natsWrapper.client).listen()
        new PaymentCreatedListener(natsWrapper.client).listen()

        // handling closing at here because process.exit should be avoided in singleton class 
        // refer nats-test for more details
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

    } catch (error) {
        console.log(error)
    }
}

app.listen(3000, async () => {
    console.log(process.env.JWT_KEY, process.env.MONGO_URI, process.env.NATS_CLUSTER_ID, process.env.NATS_URL, process.env.CLIENT_ID)
    if (!process.env.JWT_KEY || !process.env.MONGO_URI || !process.env.NATS_CLUSTER_ID || !process.env.NATS_URL || !process.env.CLIENT_ID)        // here we have to ckeck all env files are loaded properly
        throw new Error('Environment variables not defined')
    await start()
    console.log('Listening on 3000!!')
})