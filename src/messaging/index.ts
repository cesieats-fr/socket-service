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
  socketService: SocketService;
}

class Messaging implements IMessaging {
  connection: Connection;
  senders: Senders;
  receivers: Receivers;
  channel: Channel;
  socketService: SocketService;

  constructor(
    connection: Connection,
    channel: Channel,
    senders: Senders,
    receivers: Receivers,
    socketService: SocketService,
  ) {
    this.connection = connection;
    this.senders = senders;
    this.receivers = receivers;
    this.channel = channel;
    this.socketService = socketService;
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
  const receivers = new Receivers(channel);
  const senders = new Senders(channel);
  messaging = new Messaging(connection, channel, senders, receivers, socketService);
  console.log('Connected to RabbitMQ ');
}

export default Messaging;
