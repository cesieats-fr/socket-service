import { Channel, ConsumeMessage } from 'amqplib';

interface IReceivers {
  channel: Channel;
}

class Receivers implements IReceivers {
  channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;
    this.loadReceivers();
  }

  loadReceivers() {
    this.receiveHelloWorld();
    this.receiveSocketEvent();
  }

  async receiveHelloWorld() {
    await this.channel.assertQueue('hello');
    this.channel.consume('hello', (message: ConsumeMessage | null) => {
      if (message) {
        console.log('Received message:', message.content.toString());
        this.channel.ack(message);
      }
    });
  }

  async receiveSocketEvent() {
    await this.channel.assertQueue('socketEvent');
    this.channel.consume('socketEvent', (message: ConsumeMessage | null) => {
      if (message) {
        console.log('Received message:', message.content.toString());
        const value = JSON.parse(message.content.toString());
        console.log('Received message:', value);
        this.channel.ack(message);
      }
    });
  }

  disconnect() {
    this.channel.deleteQueue('hello');
  }
}

export default Receivers;
