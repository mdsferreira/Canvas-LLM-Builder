import { Agent, Edge, State } from '@/lib/context';
import axios from 'axios';

export const getAgent = (agentId: string) => {
    return axios.get<Agent>(`/api/agent/${agentId}`)
};


export const getAllAgent = () => {
    return axios.get<Agent[]>(`/api/agent`)
};


export const saveAgent = (agent: Agent) => {
    return axios.post<{ agent: Agent }>('/api/agent', agent);
};


export const saveStates = (agentId: string, states?: State[], edges?: Edge[], globalPrompt?: string) => {
    return axios.put<{ id: string }>(`/api/agent/${agentId}`, { states, edges, globalPrompt });
};


export const testAgent = (globalPrompt: string, currentStatePrompt: string, message: string) => {
    return axios.post('/api/test-agent', {
        globalPrompt,
        currentStatePrompt,
        message,
    });
};

