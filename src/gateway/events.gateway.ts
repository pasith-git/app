import { Req } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { AuthService } from "auth/auth.service";
import { Request } from "express";
import { Server, Socket } from 'socket.io';


@WebSocketGateway(1025, { transports: ['websocket'] })
export class EventsGateway {
    constructor(private authService: AuthService) { }
    @WebSocketServer() server: Server;

    @SubscribeMessage('auto-update-museum-schedules')
    handleEvent(@MessageBody() data: any, @ConnectedSocket() client: Socket): any {
        client.emit("auto-update-museum-schedules");
    }

}