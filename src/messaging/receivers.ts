import { Channel, ConsumeMessage } from 'amqplib';
import SocketService from '../socket';
import { ISocketEvent } from 'cesieats-service-types/src/socket';

interface IReceivers {
  channel: Channel;
  socketService: SocketService;
}

class Receivers implements IReceivers {
  channel: Channel;
  socketService: SocketService;

  constructor(channel: Channel, socketService: SocketService) {
    this.channel = channel;
    this.socketService = socketService;
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
        const socketEvent: ISocketEvent = JSON.parse(message.content.toString());
        this.socketService.sendToUser(socketEvent);
        this.channel.ack(message);
      }
    });
  }

  disconnect() {
    this.channel.deleteQueue('hello');
  }
}

export default Receivers;
