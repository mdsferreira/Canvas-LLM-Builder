"use client"
import React, { createContext, useState, ReactNode } from 'react';


export enum StateType {
  initial = "initial",
  default = "middle",
  final = "final"
}

export interface State {
  id: string;
  stateId: string;
  prompt: string;
  name: string;
  position?: { x: number; y: number };
  type: StateType
}

export type Edge = {
  id: string;
  edgeId: string;
  source: string;
  target: string;
  label?: string;
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
}

export const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agent, setAgent] = useState<Agent>(null);
  const [states, setStates] = useState<State[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  return (
    <AgentContext.Provider value={{ agent, setAgent, states, setStates, edges, setEdges }}>
      {children}
    </AgentContext.Provider>
  );
};
