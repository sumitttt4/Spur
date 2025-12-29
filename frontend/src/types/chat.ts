export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
};

export type ChatState = {
    messages: Message[];
    isLoading: boolean;
    sessionId: string | null;
    error: string | null;
};
