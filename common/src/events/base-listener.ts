import { Stan , Message} from 'node-nats-streaming';
import { Subjects } from './subjects';

export interface Event{
    subject : Subjects,
    data : any
}

export abstract class  Listener <T extends Event> {
    abstract subject : T['subject'];
    abstract queueGroupName : string;
    abstract onMessage(data : T['data'],msg : Message) : void;
    private client : Stan;
    protected ackWait = 5 * 1000;
  
    constructor(client: Stan) {
      this.client = client
    }
  
    subscriptionOptions()
    {
      return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable() // To receive all the past events that has occured from beginning.(First Time only)
      .setAckWait(this.ackWait) //  acknowledge when event is received
      .setDurableName(this.queueGroupName)// When service is down /restarted fetch only the events missed in that duration and no need receive all events from beginning.(Next Time onwards)
    }
  
    listen()
    {
        // subscribe to subject
        // multiple listener would join same queue group and only 1 listener from queue group would receive an event
      const subscription = this.client.subscribe(
        this.subject,
        this.queueGroupName,
        this.subscriptionOptions()
      );
  
      subscription.on("message", (msg: Message) => {
        console.log(
          `Message received : ${this.subject} | ${this.queueGroupName}`
        );
  
        const parsedData = this.parseMessage(msg)
        
        this.onMessage(parsedData,msg)
        
      });
  
    }
  
    parseMessage(msg : Message)
    {
      const data = msg.getData()
      return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'))
    }
  }
  