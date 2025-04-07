"use client";
import { useState } from "react";
import LLMBuilder from "@/components/LLMBuilder";
import TestModeSidebar from "@/components/TestModeSidebar";
import { AgentProvider } from "@/lib/context";

export default function App() {
    const [editingGlobalPrompt, setEditingGlobalPrompt] = useState(true);

    return (
        <AgentProvider>
            <div className="h-screen w-full flex">
                <LLMBuilder editingGlobalPrompt={editingGlobalPrompt} setEditingGlobalPrompt={setEditingGlobalPrompt} />
                {!editingGlobalPrompt && <TestModeSidebar />}
            </div>
        </AgentProvider>
    );
}
