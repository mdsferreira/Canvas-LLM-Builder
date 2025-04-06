import { useContext, useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';
import FlowEditor from '@/components/FlowEditor';
import { Agent, AgentContext } from '@/lib/context';
import { getAgent, getAllAgent, saveAgent } from '@/app/api/agent';
import Header from './Header';
import Footer from './Footer';

export default function LLMBuilder() {
    const { agent, setAgent, setStates, setEdges } = useContext(AgentContext);
    const [editingGlobalPrompt, setEditingGlobalPrompt] = useState(true);
    const [agents, setAgents] = useState<Agent[]>([]);

    const fetchAgent = () => {
        getAllAgent()
            .then((resp) => {
                setAgents(resp.data)
            })
            .catch()
    };

    const selectAgent = (agent: Agent) => {
        setAgent(agent)
        setEditingGlobalPrompt(false)
        getAgent(agent.id)
            .then(resp => {
                if (resp?.data?.states) setStates(resp.data.states)
                if (resp?.data?.edges) setEdges(resp.data.edges)

            })
    }

    const createNewAgent = () => {
        saveAgent(agent)
            .then((resp) => setAgent(resp.data.agent))
            .catch()
            .finally(() => setEditingGlobalPrompt(false))
    }

    useEffect(() => {
        fetchAgent();
    }, []);


    if (editingGlobalPrompt) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-xl">
                    <h1 className="text-2xl font-bold mb-4 text-center">Create a new Global Prompt</h1>
                    <Textarea
                        value={agent?.globalPrompt}
                        onChange={(e) => setAgent({ globalPrompt: e.target.value })}
                        placeholder="Enter your global prompt here..."
                        className="mb-4"
                        rows={6}
                    />
                    <Button
                        className="w-full"
                        onClick={createNewAgent}
                        disabled={!agent?.globalPrompt?.trim()}
                    >
                        Save Global Prompt
                    </Button>
                </div>
                <div className='mt-4 mb-4 bg-black h-[2px] w-full max-w-xl' />
                <h2 className="text-2xl font-bold mb-4 text-center ">Select a Prompt</h2>

                <div className='flex-column cursor-pointer w-full'>
                    <table className='border border-gray-300 w-full'>
                        <thead className='border border-gray-300'>
                            <tr>
                                <th>ID</th><th>Prompt</th>
                            </tr>
                        </thead>
                        <tbody >
                            {agents && agents?.map((a) =>
                            (<tr className='hover:bg-gray-200 border border-gray-300' onClick={() => selectAgent(a)} key={a.id}>
                                <td className='border border-gray-300'>{a.id}</td><td>{a.globalPrompt}</td>
                            </tr>))}
                        </tbody>
                    </table>

                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header setEditingGlobalPrompt={setEditingGlobalPrompt} />
            <main className="flex-1 bg-gray-100 p-4">
                <FlowEditor />
            </main>
            <Footer />
        </div>
    );
}
