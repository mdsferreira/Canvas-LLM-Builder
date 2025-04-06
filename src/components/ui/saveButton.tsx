import { useContext } from 'react';
import { saveStates } from '@/app/api/agent';
import { AgentContext } from '@/lib/context';
import Button from './button';

const SaveButton = () => {
    const { agent, states, edges } = useContext(AgentContext);

    const handleSave = () => {
        saveStates(agent.id, states, edges, agent.globalPrompt)
            .catch()
    };

    return (
        <Button
            variant="success"
            onClick={handleSave}
        >
            Save States
        </Button>
    );
};


export default SaveButton;