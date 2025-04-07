import { useContext, useState } from 'react';
import { saveStates } from '@/app/api/agent';
import { AgentContext } from '@/lib/context';
import Button from './button';
import Loading from './loading';

const SaveButton = () => {
    const { agent, states, edges } = useContext(AgentContext);
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true)
        saveStates(agent.id, states, edges, agent.globalPrompt)
            .catch()
            .finally(() => setLoading(false))
    };

    return (
        <Button
            variant="success"
            onClick={handleSave}
        >
            {loading ? <div className='flex gap-2'>Saving... <Loading /></div> : "Save States"}
        </Button>
    );
};


export default SaveButton;