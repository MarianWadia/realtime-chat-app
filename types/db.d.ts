export interface User{
    name: string;
    email: string;
    image: string;
    id: string;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: number;
}

export interface Chat{
    id: string;
    messages: Message[];
}