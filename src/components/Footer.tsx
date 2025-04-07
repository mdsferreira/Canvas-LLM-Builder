"use client";

import React, { useContext, useState } from "react";
import { AgentContext } from "@/lib/context";
import Button from "./ui/button";
import Input from "./ui/input";
import Loading from "./ui/loading";
import { saveState } from "@/app/api/agent";

export default function Footer() {
    const { states, agent, setStates } = useContext(AgentContext);
    const [newStatePrompt, setNewStatePrompt] = useState('');
    const [newStateId, setNewStateId] = useState('');
    const [loading, setLoading] = useState(false);

    const addState = () => {
        setLoading(true)
        const position = { x: 100, y: 100 + states.length * 100 };
        saveState(agent.id, newStatePrompt.trim(), newStateId, position)
            .then((resp) => {
                const newState = resp.data.state;
                setStates(states.concat(newState));
                setNewStatePrompt('');
                setNewStateId('');
            })
            .catch()
            .finally(() => setLoading(false))
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
            <Button onClick={addState} disabled={loading}>
                {loading ? <div className="flex gap-2"> Saving... <Loading /> </div> : "Create State"}
            </Button>
        </footer>
    );
}
