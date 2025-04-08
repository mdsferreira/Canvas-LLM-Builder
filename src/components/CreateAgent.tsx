import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import Textarea from './ui/textarea'
import Button from './ui/button'
import { Agent, AgentContext } from '@/lib/context'
import { editAgent, getAgent, getAllAgent, saveAgent } from '@/app/api'
import Loading from './ui/loading'

type CreateAgentProps = {
    setEditingGlobalPrompt: Dispatch<SetStateAction<boolean>>;
}

const CreateAgent: React.FC<CreateAgentProps> = ({ setEditingGlobalPrompt }) => {
    const { agent, setAgent, setStates, setEdges } = useContext(AgentContext);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAgents = () => {
        setLoading(true)
        getAllAgent()
            .then((resp) => {
                setAgents(resp.data)
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false))
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

    const createEditAgent = () => {
        if (agent?.id) {
            editAgent(agent.id, agent.globalPrompt)
                .catch((err) => console.error(err))
                .finally(() => setEditingGlobalPrompt(false))
        }
        else {
            saveAgent(agent)
                .then((resp) => setAgent(resp.data.agent))
                .catch((err) => console.error(err))
                .finally(() => setEditingGlobalPrompt(false))
        }
    }

    useEffect(() => {
        fetchAgents();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 w-full">
            <div className="w-full max-w-xl">
                <h1 className="text-2xl font-bold mb-4 text-center">Create a new Global Prompt</h1>
                <Textarea
                    value={agent?.globalPrompt}
                    onChange={(e) => setAgent({ ...agent, globalPrompt: e.target.value })}
                    placeholder="Enter your global prompt here..."
                    className="mb-4"
                    rows={6}
                />
                <Button
                    className="w-full"
                    onClick={createEditAgent}
                    disabled={!agent?.globalPrompt?.trim()}
                >
                    Save Global Prompt
                </Button>
            </div>
            <div className='mt-4 mb-4 bg-black h-[1px] w-full max-w-xl' />
            {loading ? <Loading /> :
                agents && agents.length ?
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-center ">Or Select a Prompt</h2>
                        <div className='flex-column gap-2 cursor-pointer w-full max-w-xl bg-white'>
                            {agents && agents?.map((a) =>
                            (<div className='flex hover:bg-gray-200 border border-gray-200 rounded-md p-2 gap-2' onClick={() => selectAgent(a)} key={a.id}>
                                <div >Prompt: </div>
                                <div>{a.globalPrompt}</div>
                            </div>))}
                        </div>
                    </>
                    : null
            }
        </div>
    )
}

export default CreateAgent