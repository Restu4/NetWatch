import { io, Socket } from 'socket.io-client';

const SOCKET_URL = '/';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function onDeviceUpdate(callback: (data: any) => void): void {
  getSocket().on('deviceUpdate', callback);
}

export function onAlertUpdate(callback: (data: any) => void): void {
  getSocket().on('alertUpdate', callback);
}

export function onDashboardUpdate(callback: (data: any) => void): void {
  getSocket().on('dashboardUpdate', callback);
}

export function removeAllListeners(): void {
  if (socket) {
    socket.off('deviceUpdate');
    socket.off('alertUpdate');
    socket.off('dashboardUpdate');
  }
}
