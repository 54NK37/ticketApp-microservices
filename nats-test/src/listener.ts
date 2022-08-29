import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
console.clear();

// connection to cluster with unique clientID
const client = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log(`Listener connected to NATS`);

  client.on('close',()=>{
    console.log(`NATS connection closed!`)
    process.exit()
  })

  //  acknowledge when event is received
  const options = client
  .subscriptionOptions()
  .setManualAckMode(true)
  .setDeliverAllAvailable() // To receive all the past events that has occured from beginning.(First Time only)
  .setDurableName('listener-service2') // When service is down /restarted fetch only the events missed in that duration and no need receive all events from beginning.(Next Time onwards)

  // subscribe to subject
  // multiple listener would join same queue group and only 1 listener from queue group would receive an event
  const subscription = client.subscribe(
    "ticket:created",
    "listener-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    console.log(
      `Event #${msg.getSequence()} Message received : ${msg.getData()} from : ${msg.getSubject()}`
    );
    msg.ack()
  });
});

// bydefault nats uses heart beat check for connection checking and thinks listener may be down temporarily
// so this instance may be still up in subscriptions for 30sec
// hence we get delayed event listening for existing up listeners
// to avoid this end connection forcefully and it is removed from subscription 
process.on('SIGINT',()=>client.close())
process.on('SIGTERM',()=>client.close())