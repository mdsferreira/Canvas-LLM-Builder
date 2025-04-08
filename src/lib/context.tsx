"use client"
import React, { createContext, useState, ReactNode } from 'react';


export enum StateType {
  initial = "initial",
  default = "middle",
  final = "final"
}

export interface Position { x: number; y: number }

export interface State {
  id: string;
  prompt: string;
  name: string;
  position?: Position;
  type: StateType
}

export type Edge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  keywords?: string[];
};

export type Agent = {
  id?: string;
  globalPrompt: string;
  states?: State[]
  edges?: Edge[]
};

interface AgentContextType {
  agent: Agent;
  setAgent: (agent: Agent) => void;
  states: State[];
  setStates: (states: State[]) => void;
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  selectedState: State | null;
  setSelectedState: (state: State) => void
}

export const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agent, setAgent] = useState<Agent>(null);
  const [states, setStates] = useState<State[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  return (
    <AgentContext.Provider
      value={{
        agent,
        setAgent,
        states,
        setStates,
        edges,
        setEdges,
        selectedState,
        setSelectedState
      }}>
      {children}
    </AgentContext.Provider>
  );
};
