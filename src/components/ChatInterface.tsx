import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, StopCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好，我是站点里的 AI 助手，可以和你聊代码、创作和职业规划。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when loading finishes
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [isLoading]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  };

  const clearHistory = () => {
    const defaultMsg: Message[] = [
      {
        role: 'assistant',
        content: '你好，我是站点里的 AI 助手，可以和你聊代码、创作和职业规划。'
      }
    ];
    setMessages(defaultMsg);
    localStorage.removeItem('chat_history');
  };

  // Navigation Command Parser
  const checkNavigationCommand = (content: string) => {
    const match = content.match(/\[\[NAVIGATE:\s*([^\s\]]+)\s*\]\]/);
    if (match) {
      const path = match[1];
      console.log('Navigating to:', path);
      setTimeout(() => {
        window.location.href = path;
      }, 1000);
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const API_KEY = 'sk-b5b1275162f849df9fa6c83461cdeeed';
    const apiUrl = 'https://api.deepseek.com/chat/completions';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
          stream: true,
        }),
      });

      if (!response.ok) {
        try {
          const text = await response.text();
          let errorMessage = '';
          
          // Check if response is HTML (starts with <)
          if (text.trim().startsWith('<')) {
            errorMessage = 'Internal Server Error (Backend returned HTML)';
            console.error('Backend returned HTML error:', text);
          } else {
            try {
              const json = JSON.parse(text);
              if (json && typeof json === 'object') {
                errorMessage = json.error || json.message || JSON.stringify(json);
              } else {
                errorMessage = text;
              }
            } catch {
              errorMessage = text;
            }
          }

          const friendly = `服务出了点问题：${errorMessage}。请检查后端配置或稍后再试。`;

          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: friendly }
          ]);
        } catch (readError) {
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: '服务有点异常，请稍后再试。' }
          ]);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantMessage: Message = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content || '';
              if (content) {
                assistantMessage.content += content;
                
                checkNavigationCommand(assistantMessage.content);

                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = { ...assistantMessage };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Error parsing JSON chunk', e);
            }
          }
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '网络好像有点不太稳定，请稍后再试。' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#18181b] text-gray-100 font-sans rounded-[32px] border border-neutral-800 overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="flex-none px-6 py-4 border-b border-white/5 bg-[#18181b] z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg tracking-wide">CalmSpark Chat</h2>
            <p className="text-xs text-neutral-400 font-medium tracking-wider">DeepSeek V3 · 专注于你的代码与创作</p>
          </div>
        </div>
        <button 
          onClick={clearHistory}
          className="px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all rounded-full text-sm border border-neutral-700"
          title="清空对话"
        >
          清空对话
        </button>
      </div>

      {/* Chat Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {msg.role === 'assistant' && (
                  <div className="flex-none w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mt-1">
                    <Bot className="w-4 h-4 text-zinc-400" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative max-w-[85%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm'
                      : 'bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  <div className={msg.role === 'assistant' ? 'prose prose-sm prose-invert max-w-none' : ''}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0 leading-7">{children}</p>,
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              {...props}
                              className="rounded bg-zinc-900/50 px-1.5 py-0.5 font-mono text-xs text-emerald-200"
                            />
                          ),
                          pre: ({ node, ...props }) => (
                            <pre
                              {...props}
                              className="my-3 overflow-x-auto rounded-lg border border-zinc-700/50 bg-[#121214] p-3 text-xs"
                            />
                          ),
                          ul: ({ children }) => <ul className="mb-2 space-y-1 pl-4 list-disc marker:text-zinc-500">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-2 space-y-1 pl-4 list-decimal marker:text-zinc-500">{children}</ol>,
                        }}
                      >
                        {msg.content.replace(/\[\[NAVIGATE:.*?\]\]/g, '')}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="flex-none w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mt-1">
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
             <div className="flex gap-4 justify-start">
                <div className="flex-none w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mt-1">
                  <Bot className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-3">
                   <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                   </div>
                   <span className="text-xs text-zinc-400 font-medium">DeepSeek 正在思考...</span>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-5 bg-[#18181b] border-t border-neutral-800/50">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-3"
        >
          <div className="relative flex-1 group">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="可以问我代码、职业规划，也可以随便聊聊..."
              className="w-full bg-neutral-900/50 border border-neutral-800 text-zinc-100 placeholder-neutral-500 rounded-full px-6 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none pr-12"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`flex-none p-4 rounded-full transition-all duration-300 ${
              input.trim() && !isLoading
                ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 rotate-0'
                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed rotate-90 opacity-50'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="text-center mt-3">
            <p className="text-[10px] text-neutral-600 font-medium">模型: DeepSeek V3 · 本站不会记录你的隐私数据</p>
        </div>
      </div>
    </div>
  );
}
