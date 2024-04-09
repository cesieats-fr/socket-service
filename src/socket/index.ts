import { Server, Socket } from 'socket.io';

interface SocketAccountId {
  userId: string;
  socketId: string;
}

class SocketService {
  connectedSockets: SocketAccountId[];
  io: Server;

  constructor(port: number) {
    this.io = new Server().listen(port);
    this.connectedSockets = [];
    this.start();
  }

  public start() {
    this.io.on('connection', (socket: Socket) => {
      const socketAccountId: SocketAccountId = {
        socketId: socket.id,
        userId: socket.handshake.query.userId! as string,
      };
      this.connectedSockets.push(socketAccountId);

      socket.on('disconnect', () => {
        this.connectedSockets = this.connectedSockets.filter((s) => s.socketId !== socket.id);
      });
    });
  }

  public sendToUser(userId: string, event: string, data: unknown) {
    const socketId = this.connectedSockets.find((s) => s.userId === userId)?.socketId;
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }
}

export default SocketService;
