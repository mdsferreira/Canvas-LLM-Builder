import { useContext, useEffect, useState } from 'react';
import { TestTubeDiagonal } from 'lucide-react';
import { AgentContext, Edge, State } from '@/lib/context';
import { testAgent } from '@/app/api/agent';
import Button from './ui/button';
import Input from './ui/input';

export default function TestModeSidebar() {
    const { agent, states, edges } = useContext(AgentContext);
    const [input, setInput] = useState('');
    const [chat, setChat] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
    const [currentState, setCurrentState] = useState<State>(null);

    const checkKeywordMatch = (message: string, edge: Edge): boolean => {
        const lowerMsg = message.toLowerCase();
        return edge.keywords.some((keyword) =>
            lowerMsg.includes(keyword.toLowerCase())
        );
    }

    const getNextStateId = (currentStateId: string, edges: Edge[], message: string, aiReply: string): string | null => {
        const edge = edges.find((e) => e.source === currentStateId);

        if (checkKeywordMatch(message, edge)) {
            return edge.target;
        }
        if (checkKeywordMatch(aiReply, edge)) {
            return edge.target;
        }
        return null;
    }

    const updateCurrentState = (aiReply: string, userMsg: string) => {
        const nextStateId = getNextStateId(currentState.id, edges, userMsg, aiReply);
        if (nextStateId) {
            const newState = states.find(s => s.id === nextStateId)
            setCurrentState(newState);
        }
    }

    const handleSend = () => {
        if (!input.trim() || !currentState) return;
        const userMsg = input.trim();
        setChat((prev) => [...prev, { role: 'user', text: userMsg }]);
        const fullChat = chat.map((msg) => ({
            role: msg.role,
            content: msg.text,
        }));
        setInput('');
        testAgent(agent.globalPrompt, currentState?.prompt, fullChat, userMsg)
            .then((res) => {
                const aiReply = res.data.reply;
                setChat((prev) => [...prev, { role: 'assistant', text: aiReply }]);
                updateCurrentState(aiReply, userMsg)
            })
            .catch(() => {
                setChat((prev) => [
                    ...prev,
                    { role: 'assistant', text: '⚠️ Error contacting OpenAI.' },
                ]);
            })
    };

    useEffect(() => {
        if (!currentState) setCurrentState(states[0])
    }, [states])

    if (!states || !states.length) return (
        <div className="w-1/3 h-full border-l border-gray-200 bg-white flex flex-col p-4">
            <h2 className="text-lg font-semibold mb-4 flex gap-2 items-center"><TestTubeDiagonal size={16} /> Test Mode</h2>
            <h5 className="text-md text-green-500 ">SAVE THE AGENT TO TEST!</h5>
        </div>
    );

    return (
        <div className="w-1/3 h-full border-l border-gray-200 bg-white flex flex-col p-4">
            <h2 className="text-lg font-semibold mb-4 flex gap-2 items-center"><TestTubeDiagonal size={16} /> Test Mode</h2>
            <h5 className="text-md text-green-500 italic">Current State: {currentState?.name}</h5>
            {/* Chat history */}
            <div className="flex-1 overflow-y-auto rounded bg-gray-50 p-2 text-sm space-y-2 overflow-y-auto">
                {chat.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                            }`}
                    >
                        <strong>{msg.role === 'user' ? 'You:' : 'Agent:'}</strong>{' '}
                        {msg.text}
                    </div>
                ))}
            </div>
            {/* Input field */}
            <div className="flex mt-4 gap-2">
                <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <Button
                    onClick={handleSend}
                >
                    Send
                </Button>
            </div>
        </div>
    );
}
