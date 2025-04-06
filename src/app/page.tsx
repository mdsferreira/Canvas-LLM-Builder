"use client";

import LLMBuilder from "@/components/LLMBuilder";
import { AgentProvider } from "@/lib/context";

export default function App() {
    return (
        <AgentProvider>
            <div className="h-screen w-full flex flex-col">
                <LLMBuilder />
            </div>
        </AgentProvider>
    );
}
