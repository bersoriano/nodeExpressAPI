export interface Message {
    id: number;
    content: string;
  }

export const messages: Message[] = [
    { id: 1, content: 'Hello from message 1' },
    { id: 2, content: 'This is message number 2' },
];