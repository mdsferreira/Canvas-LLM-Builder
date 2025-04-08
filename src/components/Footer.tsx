"use client";

import React, { useContext, useEffect, useState } from "react";
import { AgentContext } from "@/lib/context";
import Button from "./ui/button";
import Input from "./ui/input";
import Loading from "./ui/loading";
import { deleteState, editState, saveState } from "@/app/api";
import { Trash2 } from "lucide-react";

export default function Footer() {
    const { states, agent, setStates, selectedState, setSelectedState } = useContext(AgentContext);
    const [newStatePrompt, setNewStatePrompt] = useState('');
    const [newStateId, setNewStateId] = useState('');
    const [loading, setLoading] = useState(false);

    const reset = () => {
        setSelectedState(null);
        setNewStatePrompt('');
        setNewStateId('');
    }

    const addState = () => {
        setLoading(true)
        const position = { x: 100, y: 100 + states.length * 100 };
        if (!selectedState) {
            saveState(agent.id, newStatePrompt.trim(), newStateId, position)
                .then((resp) => {
                    const newState = resp.data.state;
                    setStates(states.concat(newState));
                    setNewStatePrompt('');
                    setNewStateId('');
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false))
        }
        else {
            editState(selectedState.id, newStatePrompt.trim(), newStateId)
                .then((resp) => {
                    const newState = resp.data.state;
                    console.log(newState)
                    setStates(states.concat(newState));
                    reset()
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false))
        }
    };

    const renderBtnLabel = () => {
        if (loading) return <div className="flex gap-2"> Saving... <Loading /> </div>
        if (selectedState) return "Edit State"
        return "Create State"
    }

    const handleDeleteState = () => {
        deleteState(selectedState.id)
            .then(() => {
                setStates(states.filter(s => s.id !== selectedState.id))
                reset()
            })
    }

    useEffect(() => {
        if (selectedState) {
            setNewStatePrompt(selectedState.prompt)
            setNewStateId(selectedState.name)
        }
    }, [selectedState])

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
            {selectedState &&
                <>
                    <Button variant="ghost" className="flex gap-2 items-center" onClick={handleDeleteState}>
                        <Trash2 size={15} color="red" /> Delete State
                    </Button>
                    <Button variant="outline" className="flex gap-2 items-center" onClick={() => reset()}>
                        Cancel
                    </Button>
                </>
            }
            <Button onClick={addState} disabled={loading} variant={selectedState ? "default" : "success"}>
                {renderBtnLabel()}
            </Button>

        </footer>
    );
}
