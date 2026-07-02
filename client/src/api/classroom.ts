import { Client } from '@stomp/stompjs';

export interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE';
}

export const createStompClient = (
  roomId: string,
  onMessage: (msg: ChatMessage) => void,
  onConnect?: () => void
): Client => {
  const client = new Client({
    // Use native WebSocket — no sockjs-client needed
    brokerURL: 'ws://localhost:8081/ws',
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe(`/topic/classroom/${roomId}`, (frame) => {
        const msg: ChatMessage = JSON.parse(frame.body);
        onMessage(msg);
      });
      if (onConnect) onConnect();
    },
    onStompError: (frame) => {
      console.error('STOMP error', frame);
    },
  });
  return client;
};

export const sendMessage = (client: Client, roomId: string, message: ChatMessage) => {
  if (!client.active) return;
  client.publish({
    destination: `/app/classroom/${roomId}`,
    body: JSON.stringify(message),
  });
};
