import { Server, Socket } from 'socket.io';
import { ISocketAccountId, ISocketEvent } from 'cesieats-service-types/src/socket';

class SocketService {
  connectedSockets: ISocketAccountId[];
  io: Server;

  constructor(port: number) {
    this.io = new Server().listen(port, {
      cors: {
        origin: '*',
      },
    });
    this.connectedSockets = [];
    this.start();
  }

  public start() {
    this.io.on('connection', (socket: Socket) => {
      const socketAccountId: ISocketAccountId = {
        socketId: socket.id,
        userId: socket.handshake.query.userId! as string,
      };
      this.connectedSockets.push(socketAccountId);

      socket.on('disconnect', () => {
        this.connectedSockets = this.connectedSockets.filter((s) => s.socketId !== socket.id);
      });
    });
  }

  public sendToUser({ userId, event, data }: ISocketEvent) {
    const socketId = this.connectedSockets.find((s) => s.userId === userId)?.socketId;
    if (socketId) {
      console.log(`Sending event ${event} to user ${userId}`);
      this.io.to(socketId).emit(event, data);
    }
  }
}

export default SocketService;
