import { useState, useEffect, useCallback } from 'react';
import { getSocket, disconnectSocket, removeAllListeners } from '../services/socket';

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('deviceUpdate', () => {
      setLastUpdate(new Date());
    });

    socket.on('alertUpdate', () => {
      setLastUpdate(new Date());
    });

    socket.on('dashboardUpdate', () => {
      setLastUpdate(new Date());
    });

    return () => {
      removeAllListeners();
      disconnectSocket();
    };
  }, []);

  const forceReconnect = useCallback(() => {
    disconnectSocket();
    getSocket().connect();
  }, []);

  return { connected, lastUpdate, forceReconnect };
}
