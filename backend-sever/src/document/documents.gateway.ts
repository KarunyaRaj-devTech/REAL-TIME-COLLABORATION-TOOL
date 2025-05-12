// src/document/documents.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentDto, UpdateDocumentDto } from './document.dto';
import { UserService } from '../user/user.service';

@Injectable()
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
export class DocumentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly documentsService: DocumentService,
    private readonly userService: UserService,
  ) {}

  @SubscribeMessage('send message')
  handleMessage(@MessageBody() clientmsg: string): void {
    console.log('listening here in document gateway');
    this.server.emit('received_message', clientmsg);
  }

  @SubscribeMessage('new-document')
  async createDocument(client: Socket, documentData: any): Promise<void> {
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

    const document = await this.documentsService.createDocument(modifiedDocumentData);
    console.log(`New Document created: ${document}`);
    
    this.server.to(documentData.clientId).emit('new-document-created', document);
  }

  @SubscribeMessage('document-join-req')
  async join(client: Socket, documentJoinRequest: any): Promise<void> {
    const { name, email, clientId, doumentTobeEdited } = documentJoinRequest;
    console.log('documentJoinRequest:', documentJoinRequest);
    console.log('doumentTobeEdited:', doumentTobeEdited);
  }

  broadcastChanges(clientId: string, content: any): void {
    this.server.to(clientId).emit('sharing-requested-document', content);
  }

  @SubscribeMessage('edit-document')
  async editDocument(client: Socket, editingDocumentData: any): Promise<void> {
    console.log('edit-document - gateway', editingDocumentData.documentContent);
    console.log('userid:', editingDocumentData.clientId);
    console.log('documentId:', editingDocumentData.documentId);
  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody() data: { name: string; email: string; clientId: string },
  ): Promise<{ success: boolean }> {
    console.log('Listening to join event from client');
    const { name, email, clientId } = data;
    await this.userService.mapClientIdToUserId(name, email, clientId);
    return { success: true };
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const clientName = await this.userService.getClientInfoByClientId(client.id);
    client.broadcast.emit('typing', { clientName, isTyping });
  }

  handleConnection(client: Socket): void {
    console.log(`Documents gateway - Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }
}