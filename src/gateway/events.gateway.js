"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.EventsGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var EventsGateway = /** @class */ (function () {
    function EventsGateway(authService) {
        this.authService = authService;
    }
    EventsGateway.prototype.handleEvent = function (data, client) {
        client.emit("auto-update-museum-schedules");
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], EventsGateway.prototype, "server");
    __decorate([
        (0, websockets_1.SubscribeMessage)('auto-update-museum-schedules'),
        __param(0, (0, websockets_1.MessageBody)()),
        __param(1, (0, websockets_1.ConnectedSocket)())
    ], EventsGateway.prototype, "handleEvent");
    EventsGateway = __decorate([
        (0, websockets_1.WebSocketGateway)(1025, { transports: ['websocket'] })
    ], EventsGateway);
    return EventsGateway;
}());
exports.EventsGateway = EventsGateway;
