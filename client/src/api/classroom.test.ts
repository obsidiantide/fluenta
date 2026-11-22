import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatMessage } from './classroom';

type ClientConfig = {
  brokerURL: string;
  reconnectDelay: number;
  onConnect: () => void;
  onStompError: (frame: unknown) => void;
};

const instances: FakeClient[] = [];

class FakeClient {
  active = true;
  config: ClientConfig;
  subscribe = vi.fn();
  publish = vi.fn();
  constructor(config: ClientConfig) {
    this.config = config;
    instances.push(this);
  }
}

vi.mock('@stomp/stompjs', () => ({ Client: FakeClient }));

const { createStompClient, sendMessage } = await import('./classroom');

const message: ChatMessage = {
  sender: 'anna@example.com',
  content: 'Hello',
  timestamp: '2025-01-01T10:00:00Z',
  type: 'CHAT',
};

beforeEach(() => {
  instances.length = 0;
  vi.restoreAllMocks();
});

describe('createStompClient', () => {
  it('connects over the ws URL with a reconnect delay', () => {
    createStompClient('room-1', vi.fn());
    expect(instances[0].config.brokerURL).toMatch(/^wss?:\/\/.+\/ws$/);
    expect(instances[0].config.reconnectDelay).toBe(5000);
  });

  it('subscribes to the room topic and forwards parsed messages', () => {
    const onMessage = vi.fn();
    const onConnect = vi.fn();
    createStompClient('room-1', onMessage, onConnect);
    const client = instances[0];

    client.config.onConnect();
    expect(client.subscribe).toHaveBeenCalledWith('/topic/classroom/room-1', expect.any(Function));
    expect(onConnect).toHaveBeenCalledTimes(1);

    const handler = client.subscribe.mock.calls[0][1] as (frame: { body: string }) => void;
    handler({ body: JSON.stringify(message) });
    expect(onMessage).toHaveBeenCalledWith(message);
  });

  it('works without an onConnect callback', () => {
    createStompClient('room-1', vi.fn());
    expect(() => instances[0].config.onConnect()).not.toThrow();
  });

  it('logs STOMP errors instead of throwing', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    createStompClient('room-1', vi.fn());
    instances[0].config.onStompError({ headers: {} });
    expect(spy).toHaveBeenCalledWith('STOMP error', { headers: {} });
  });
});

describe('sendMessage', () => {
  it('publishes JSON to the room destination', () => {
    const client = createStompClient('room-7', vi.fn());
    sendMessage(client, 'room-7', message);
    const fake = instances[0];
    expect(fake.publish).toHaveBeenCalledWith({
      destination: '/app/classroom/room-7',
      body: JSON.stringify(message),
    });
  });

  it('does nothing while the client is inactive', () => {
    const client = createStompClient('room-7', vi.fn());
    instances[0].active = false;
    sendMessage(client, 'room-7', message);
    expect(instances[0].publish).not.toHaveBeenCalled();
  });
});
