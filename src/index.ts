import 'dotenv/config';
import { connectRabbitMQ } from './messaging';
import SockerService from './socket';

const port = parseInt(process.env.PORT!) || 3000;

const socketService = new SockerService(port);

connectRabbitMQ(socketService);
