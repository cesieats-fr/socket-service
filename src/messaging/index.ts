import { Connection, Channel, connect } from 'amqplib';
import Senders from './senders';
import Receivers from './receivers';
import SocketService from '../socket';

export let messaging: Messaging;

interface IMessaging {
  connection: Connection;
  senders: Senders;
  receivers: Receivers;
  channel: Channel;
}

class Messaging implements IMessaging {
  connection: Connection;
  senders: Senders;
  receivers: Receivers;
  channel: Channel;

  constructor(connection: Connection, channel: Channel, senders: Senders, receivers: Receivers) {
    this.connection = connection;
    this.senders = senders;
    this.receivers = receivers;
    this.channel = channel;
  }

  disconnect() {
    this.senders.disconnect();
    this.receivers.disconnect();
    this.connection.close();
  }
}

export async function connectRabbitMQ(socketService: SocketService) {
  const connection = await connect(`amqp://${process.env.RABBITMQ_URL}`, {
    username: process.env.RABBITMQ_USERNAME,
    password: process.env.RABBITMQ_PASSWORD,
  });
  const channel = await connection.createChannel();
  const receivers = new Receivers(channel, socketService);
  const senders = new Senders(channel);
  messaging = new Messaging(connection, channel, senders, receivers);
  console.log('Connected to RabbitMQ ');
}

export default Messaging;
