import { ChatWidget } from "@/components/chat/chat-widget";

export default function Home() {
  return (
    <main className="h-screen w-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md flex flex-col h-full max-h-[85vh]">
        <div className="text-center mb-6 shrink-0">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">Spur Chat</h1>
          <p className="text-zinc-500 text-sm">Experience the future of customer support.</p>
        </div>
        <div className="flex-1 min-h-0">
          <ChatWidget className="h-full" />
        </div>
      </div>
    </main>
  );
}
