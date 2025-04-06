"use client";

import React, { useContext, useState } from "react";
import { AgentContext, StateType } from "@/lib/context";
import Button from "./ui/button";
import Input from "./ui/input";

export default function Footer() {
    const { states, setStates } = useContext(AgentContext);
    const [newStatePrompt, setNewStatePrompt] = useState('');
    const [newStateId, setNewStateId] = useState('');

    const addState = () => {
        if (!newStatePrompt.trim()) return;
        if (states.length >= 2) {
            const lastState = states[states.length - 1];
            lastState.type = StateType.default;
        }
        const newState = {
            id: Date.now().toString(),
            prompt: newStatePrompt.trim(),
            name: newStateId,
            position: { x: 100, y: 100 + states.length * 100 },
            type: !states.length ? StateType.initial : StateType.default,
        };
        setStates([...states, newState]);
        setNewStatePrompt('');
        setNewStateId('');

    };

    return (
        <footer className="bg-white p-4 shadow flex items-center gap-2">
            <Input
                value={newStateId}
                onChange={(e) => setNewStateId(e.target.value)}
                placeholder="Type the unic state Name"
                className="flex-1"
            />
            <Input
                value={newStatePrompt}
                onChange={(e) => setNewStatePrompt(e.target.value)}
                placeholder="State-Specific Prompt"
                className="flex-2"
            />
            <Button onClick={addState}>Create State</Button>
        </footer>
    );
}
