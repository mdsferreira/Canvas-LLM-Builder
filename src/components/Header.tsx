"use client";

import React, { Dispatch, SetStateAction, useContext } from "react";
import { AgentContext } from "@/lib/context";
import Button from "./ui/button";
import SaveButton from "./ui/saveButton";

interface HeaderProps {
    setEditingGlobalPrompt: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ setEditingGlobalPrompt }: HeaderProps) {
    const { agent } = useContext(AgentContext);

    return (
        <header className="bg-white shadow p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 w-full">
                <div className="flex-1 text-gray-700 text-[12px] border border-gray-200 p-2 border-solid rounded-sm">
                    {agent?.globalPrompt}
                </div>
                <Button onClick={() => setEditingGlobalPrompt(true)}>
                    Edit Global Prompt
                </Button>
                <SaveButton />
            </div>
        </header>
    );
}
