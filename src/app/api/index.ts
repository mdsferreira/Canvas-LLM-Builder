import { Agent, Edge, Position, State } from '@/lib/context';
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

export const saveState = (agentId: string, prompt: string, name: string, position: Position) => {
    return axios.post<{ state: State }>(`/api/states`, { agentId, prompt, name, position });
};

export const editState = (stateId: string, prompt: string, name: string) => {
    return axios.put<{ state: State }>(`/api/states/${stateId}`, { prompt, name });
};

export const editAgent = (agentId: string, globalPrompt?: string, states?: State[], edges?: Edge[]) => {
    return axios.put<{ id: string }>(`/api/agent/${agentId}`, { states, edges, globalPrompt });
};

export const deleteState = (stateId: string) => {
    return axios.delete<{ success: boolean }>(`/api/states/${stateId}`);
};

export const testAgent = (globalPrompt: string, currentStatePrompt: string, fullChat: any, message: string) => {
    return axios.post('/api/test-agent', {
        globalPrompt,
        currentStatePrompt,
        chatHistory: fullChat,
        message,
    });
};

export const saveEdge = (agentId: string, source: string, target: string, label?: string) => {
    return axios.post<{ edge: Edge }>(`/api/edges`, {
        agentId,
        source,
        target,
        label,
    });
};

export const saveEdgeKeys = (edgeId: string, keywords: string[]) => {
    return axios.put<{ edge: Edge }>(`/api/edges/${edgeId}`, { keywords });
};

export const deleteEdge = (edgeId: string) => {
    return axios.delete<{ success: boolean }>(`/api/edges/${edgeId}`);
};

