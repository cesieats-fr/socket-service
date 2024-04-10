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
    this.connectedSockets.forEach((s) => {
      if (s.accountId === accountId) {
        this.io.to(s.socketId).emit(event, data);
      }
    });
  }
}

export default SocketService;
