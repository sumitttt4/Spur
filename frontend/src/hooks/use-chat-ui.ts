import { useState, useCallback, useEffect } from 'react';
import { Message } from '../types/chat';



export function useChatUI() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load session from local storage on mount
    useEffect(() => {
        const savedSession = localStorage.getItem('spur_chat_session');
        if (savedSession) {
            setSessionId(savedSession);
            fetchHistory(savedSession);
        }
    }, []);

    const fetchHistory = async (id: string) => {
        try {
            setIsLoading(true);
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api/chat';

            // Create a timeout controller
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for history

            const res = await fetch(`${API_BASE}/${id}`, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const historyData = await res.json();
                setMessages(historyData.messages);
            }
        } catch (e) {
            console.error("Failed to load history", e);
        } finally {
            setIsLoading(false);
        }
    };

    const resetChat = useCallback(() => {
        setSessionId(null);
        setMessages([]);
        localStorage.removeItem('spur_chat_session');
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        const tempId = Date.now().toString();
        const userMsg: Message = {
            id: tempId,
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);
        setError(null);

        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api/chat';

            // Create a timeout controller to prevent hanging forever
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

            const res = await fetch(`${API_BASE}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: content,
                    sessionId,
                }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error('Failed to send message');
            }

            const data = await res.json();

            const aiMsg: Message = {
                id: Date.now().toString() + '-ai',
                role: 'assistant',
                content: data.reply,
                createdAt: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, aiMsg]);

            if (data.sessionId && data.sessionId !== sessionId) {
                setSessionId(data.sessionId);
                localStorage.setItem('spur_chat_session', data.sessionId);
            }
        } catch (err) {
            setError('Failed to get response. Please try again.');
            // Optionally remove the user message or show error state on it
        } finally {
            setIsLoading(false);
        }
    }, [sessionId]);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        resetChat,
        sessionId
    };
}
