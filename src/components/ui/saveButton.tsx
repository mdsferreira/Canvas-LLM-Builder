import { useContext, useState } from 'react';
import { editAgent } from '@/app/api';
import { AgentContext } from '@/lib/context';
import Button from './button';
import Loading from './loading';

const SaveButton = () => {
    const { agent, states, edges } = useContext(AgentContext);
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true)
        editAgent(agent.id, agent.globalPrompt, states, edges)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false))
    };

    return (
        <Button
            variant="success"
            onClick={handleSave}
        >
            {loading ? <div className='flex gap-2'>Saving... <Loading /></div> : "Save States Positions"}
        </Button>
    );
};


export default SaveButton;