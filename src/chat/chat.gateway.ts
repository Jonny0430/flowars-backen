import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UpdateUserDto } from 'src/user/dto/user.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // Foydalanuvchi ulanishi
  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    try {
      const lastMessages = await this.chatService.getLastMessages();
      console.log(`Sending previous messages to ${client.id}:`, lastMessages);
      client.emit('previous_messages', lastMessages);
    } catch (error) {
      console.error(`Error fetching messages for client ${client.id}:`, error.message);
    }
  }

  // Foydalanuvchi uzilishi
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Xabarni qabul qilish va jo'natish
  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() data: UpdateUserDto, @ConnectedSocket() client: Socket) {
    try {
      console.log(`Message received: ${data.firsName}`);
      const savedMessage = await this.chatService.saveMessage(data);
      this.server.emit('receive_message', savedMessage);
    } catch (error) {
      console.error('Error in handleMessage:', error.message);
      client.emit('error_message', { message: 'Failed to send message.' });
    }
  }
}
