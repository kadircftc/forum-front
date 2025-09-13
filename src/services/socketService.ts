import { io, Socket } from 'socket.io-client';
import { JwtTokenManager } from '../infrastructure/token/JwtTokenManager';
import type { MessageDto } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private tokenManager: JwtTokenManager;

  constructor() {
    this.tokenManager = new JwtTokenManager();
  }

  connect(): void {
    if (this.socket) {
      this.disconnect();
    }

    const token = this.tokenManager.getToken();
    if (!token) {
      console.warn('Socket bağlantısı için token bulunamadı');
      return;
    }

    const socketUrl = import.meta.env.VITE_API_BASE_URL;
    
    this.socket = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      this.isConnected = false;
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Kullanıcı ID'sini socket'e ayarla
  setUser(userId: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('set_user', userId);
    }
  }

  // Yeni mesaj dinleyicisi
  onNewMessage(callback: (message: MessageDto & { 
    is_mine: boolean; 
    align: 'left' | 'right'; 
    username?: string; 
    thread_title?: string; 
    category_name?: string; 
    category_id?: number;
  }) => void): void {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  offNewMessage(callback?: (message: MessageDto & { 
    is_mine: boolean; 
    align: 'left' | 'right'; 
    username?: string; 
    thread_title?: string; 
    category_name?: string; 
    category_id?: number;
  }) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('new_message', callback);
      } else {
        this.socket.off('new_message');
      }
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Token yenilendiğinde socket bağlantısını yenile
  refreshConnection(): void {
    if (this.isConnected) {
      this.disconnect();
      this.connect();
    }
  }
}

export default new SocketService();
