'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useChatUI } from '@/hooks/use-chat-ui';
import { Send, Sparkles, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function ChatWidget({ className }: { className?: string }) {
    const { messages, isLoading, error, sendMessage } = useChatUI();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <Card className={cn("flex flex-col w-full mx-auto shadow-xl border-zinc-200 dark:border-zinc-800 overflow-hidden", className)}>
            <CardHeader className="bg-zinc-50 dark:bg-zinc-900 border-b p-4 flex flex-row items-center space-y-0 gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Spur Assistant</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">Online</span>
                    </div>
                </div>
            </CardHeader>

            <ScrollArea className="flex-1 min-h-0 p-4 bg-zinc-50/50 dark:bg-zinc-900/50" ref={scrollRef}>
                <div className="flex flex-col min-h-full space-y-4 pr-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col flex-1 items-center justify-center text-zinc-400 space-y-4 opacity-70">
                            <Bot className="w-16 h-16 mb-2 stroke-1" />
                            <p className="text-sm font-medium">Ask me about shipping, returns, or support!</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[85%] px-4 py-3 text-sm shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                                        : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-tl-sm"
                                )}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start w-full animate-in fade-in duration-300">
                            <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl rounded-tl-sm border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                                <span className="text-xs text-zinc-400 font-medium">Thinking...</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-center w-full animate-in fade-in slide-in-from-top-2">
                            <Badge variant="destructive" className="py-1 px-3">
                                {error}
                            </Badge>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <CardFooter className="p-4 bg-white dark:bg-zinc-900 border-t">
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
                    <div className="flex w-full gap-2 relative">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 rounded-full px-4 border-zinc-200 focus-visible:ring-blue-500/20"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || isLoading}
                            className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 w-10 h-10 shrink-0"
                        >
                            <Send className="w-4 h-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                    <div className="text-center">
                        <span className="text-[10px] text-zinc-400 font-medium">Powered by OpenAI & Spur</span>
                    </div>
                </form>
            </CardFooter>
        </Card>
    );
}
