// components/TestModeSidebar.tsx

import { useContext, useState } from 'react';
import axios from 'axios';
import { AgentContext } from '@/lib/context';
import { testAgent } from '@/app/api/agent';
import Button from './ui/button';
import Input from './ui/input';

export default function TestModeSidebar() {
    const { agent, states } = useContext(AgentContext);
    const [input, setInput] = useState('');
    const [chat, setChat] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
    const [currentState, setCurrentState] = useState({ id: 0, state: states[0] });

    const updateCurrentState = (aiReply: string) => {
        if (states.length < currentState.id) {
            setCurrentState({ id: currentState.id + 1, state: states[currentState.id] })
        }
    }

    const handleSend = () => {
        if (!input.trim() || !currentState.state) return;

        const userMsg = input.trim();
        setChat((prev) => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        testAgent(agent.globalPrompt, currentState?.state.prompt, userMsg)
            .then((res) => {
                const aiReply = res.data.reply;
                setChat((prev) => [...prev, { role: 'ai', text: aiReply }]);
                updateCurrentState(aiReply)
            })
            .catch((err) => {
                setChat((prev) => [
                    ...prev,
                    { role: 'ai', text: '⚠️ Error contacting OpenAI.' },
                ]);
            })
    };

    if (!states || !states.length) return (
        <div className="w-1/3 h-full border-l border-gray-200 bg-white flex flex-col p-4">
            <h2 className="text-lg font-semibold mb-4">🧪 Test Mode</h2>
            <h5 className="text-md text-green-500 ">SAVE THE AGENT TO TEST!</h5>
        </div>
    );

    return (
        <div className="w-1/3 h-full border-l border-gray-200 bg-white flex flex-col p-4">
            <h2 className="text-lg font-semibold mb-4">🧪 Test Mode</h2>
            <h5 className="text-md text-green-500 italic">Current State: {currentState.state?.name}</h5>
            {/* Chat history */}
            <div className="flex-1 overflow-y-auto rounded bg-gray-50 p-2 text-sm space-y-2">
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
