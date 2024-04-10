import { Server, Socket } from 'socket.io';
import { ISocketAccountId, ISocketEvent } from 'cesieats-service-types/src/socket';

class SocketService {
  connectedSockets: ISocketAccountId[];
  io: Server;

  constructor(port: number) {
    this.io = new Server({ cors: { origin: '*' } }).listen(port);
    this.connectedSockets = [];
    this.start();
  }

  public start() {
    this.io.on('connection', (socket: Socket) => {
      const socketAccountId: ISocketAccountId = {
        socketId: socket.id,
        accountId: socket.handshake.query.accountId! as string,
      };
      this.connectedSockets.push(socketAccountId);

      socket.on('disconnect', () => {
        this.connectedSockets = this.connectedSockets.filter((s) => s.socketId !== socket.id);
      });
    });
  }

  public sendToUser({ accountId, event, data }: ISocketEvent) {
    console.log(accountId, event, data);
    const socketId = this.connectedSockets.find((s) => s.accountId === accountId)?.socketId;
    if (socketId) {
      console.log(`Sending event ${event} to user ${accountId}`);
      this.io.to(socketId).emit(event, data);
    }
  }
}

export default SocketService;
