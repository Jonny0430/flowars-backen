import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ cors: { origin: '*' } }) // CORS ruxsat
  export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server; // Socket.IO server obyekti
    private logger: Logger = new Logger('AppGateway');
  
    // Server ishga tushganda chaqiriladi
    afterInit(server: Server) {
      this.logger.log('Socket.IO server initialized');
    }
  
    // Foydalanuvchi ulanganda
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
      client.emit('welcome', 'Welcome to Socket.IO server!');
    }
  
    // Foydalanuvchi uzilganda
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    // Custom event ishlash
    handleMessage(client: Socket, payload: any) {
      this.server.emit('message', payload); // Barcha ulangan klientlarga xabar yuborish
    }
  }
  