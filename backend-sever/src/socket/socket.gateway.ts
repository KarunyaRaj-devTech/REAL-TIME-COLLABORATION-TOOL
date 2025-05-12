// src/socket/socket.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { DocumentService } from '../document/document.service';
import { DocumentDto } from '../document/document.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
    ],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UserService,
    private readonly documentService: DocumentService,
  ) {}

  handleConnection(client: Socket): void {
    console.log(`Socket-gateway User connected: ${client.id}`);
    client.on('userid-to-clientId-map', async (data: { fullname: string; email: string; clientId: string }) => {
      console.log('Socket-gateway inside userid map:', data);
      const { fullname, email, clientId } = data;
      await this.userService.mapClientIdToUserId(fullname, email, clientId);
    });
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, room: string): void {
    console.log('join-room event received:', room);
    client.join(room);
    console.log(`User ${client.id} joined room ${room}`);
  }

  @SubscribeMessage('send_message')
  handleMessage(
    client: Socket,
    payload: { room: string; message: string },
  ): void {
    console.log('listening here in socket gateway');
    client.to(payload.room).emit('received_message', { message: payload.message });
  }

  @SubscribeMessage('edit-document')
  handleEditDocument(
    client: Socket,
    payload: { room: string; content: string },
  ): void {
    const { room, content } = payload;
    console.log(`User ${client.id} edited document in room ${room}`);
    client.to(room).emit('document-content-update', content);
  }

  @SubscribeMessage('user_start_typing')
  async handleUserStartTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; fullname: string; email: string },
  ): Promise<void> {
    console.log('user start typing event received at server side');
    const { roomId, fullname, email } = payload;
    
    await this.userService.mapClientIdToUserId(fullname, email, client.id);
    const userInfo = await this.userService.getClientInfoByClientId(client.id);
    
    if (!userInfo) {
      throw new Error('User info not found');
    }

    client.to(roomId).emit('typing_indicator', {
      fullname: userInfo.fullname,
      isTyping: true,
    });
  }

  @SubscribeMessage('user_stop_typing')
  async handleUserStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; fullname: string; email: string },
  ): Promise<void> {
    const { roomId, fullname, email } = payload;
    
    await this.userService.mapClientIdToUserId(fullname, email, client.id);
    const userInfo = await this.userService.getClientInfoByClientId(client.id);
    
    if (!userInfo) {
      throw new Error('User info not found');
    }

    client.to(roomId).emit('typing_indicator', {
      fullname: userInfo.fullname,
      isTyping: false,
    });
  }

  @SubscribeMessage('updateStyleBold')
  handleUpdateStyleBold(client: Socket, bold: boolean): void {
    console.log('inside bold:', bold);
    client.broadcast.emit('updateStyleBold', bold);
  }

  @SubscribeMessage('updateStyleItalic')
  handleUpdateStyleItalic(client: Socket, italic: boolean): void {
    client.broadcast.emit('updateStyleItalic', italic);
  }

  @SubscribeMessage('updateStyleUnderline')
  handleUpdateStyleUnderline(client: Socket, underline: boolean): void {
    client.broadcast.emit('updateStyleUnderline', underline);
  }

  @SubscribeMessage('save-document')
  async createDocument(
    client: Socket,
    documentData: any,
  ): Promise<void> {
    console.log('Received new document:', documentData);
    
    await this.userService.mapClientIdToUserId(
      documentData.fullname,
      documentData.email,
      documentData.clientId,
    );
    
    const user = await this.userService.getClientInfoByClientId(documentData.clientId);
    if (!user || !user._id) {
      throw new Error('User not found or invalid user ID');
    }

    const modifiedDocumentData: DocumentDto = {
      title: documentData.title,
      content: documentData.content,
      userId: user._id.toString(), // Ensure userId is string
    };

    const document = await this.documentService.createDocument(modifiedDocumentData);
    console.log(`New Document created: ${document}`);
    
    this.server.to(documentData.clientId).emit('save-document-success', document);
  }

  handleDisconnect(client: Socket): void {
    console.log(`User disconnected: ${client.id}`);
  }
}