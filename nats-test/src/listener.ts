import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from './events/ticket-created-listener';
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

   new TicketCreatedListener(client).listen() 
});

// bydefault nats uses heart beat check for connection checking and thinks listener may be down temporarily
// so this instance may be still up in subscriptions for 30sec
// hence we get delayed event listening for existing up listeners
// to avoid this end connection forcefully and it is removed from subscription 
process.on('SIGINT',()=>client.close())
process.on('SIGTERM',()=>client.close())