import { Dispatch, SetStateAction } from 'react';
import FlowEditor from '@/components/FlowEditor';
import Header from './Header';
import Footer from './Footer';
import CreateAgent from './CreateAgent';

interface LLMBuilderProps {
    editingGlobalPrompt: boolean;
    setEditingGlobalPrompt: Dispatch<SetStateAction<boolean>>;
}

const LLMBuilder: React.FC<LLMBuilderProps> = ({ editingGlobalPrompt, setEditingGlobalPrompt }) => {
    if (editingGlobalPrompt) {
        return (<CreateAgent setEditingGlobalPrompt={setEditingGlobalPrompt} />);
    }

    return (
        <div className="flex flex-col w-2/3 min-h-screen">
            <Header setEditingGlobalPrompt={setEditingGlobalPrompt} />
            <main className="flex-1 bg-gray-100 p-4">
                <FlowEditor />
            </main>
            <Footer />
        </div>
    );
}


export default LLMBuilder