'use client';

import { useContext, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import Button from './ui/button';
import Input from './ui/input';
import { saveEdgeKeys } from '@/app/api/agent';
import { AgentContext } from '@/lib/context';

interface EdgeKeywordModalProps {
    edgeId: string;
    initialKeywords: string[];
    isOpen: boolean;
    onClose: () => void;
    onSave?: (keywords: string[]) => void;
};

const EdgeKeywordModal: React.FC<EdgeKeywordModalProps> = ({ edgeId, initialKeywords, isOpen, onClose, onSave }) => {
    const [keywords, setKeywords] = useState(initialKeywords || []);
    const [newKeyword, setNewKeyword] = useState('');
    const { setEdges, edges } = useContext(AgentContext);
    const [error, setError] = useState('');

    const addKeyword = () => {
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            setKeywords([...keywords, newKeyword.trim()]);
            setNewKeyword('');
            setError('')
        }
    };

    const removeKeyword = (keyword: string) => {
        setKeywords((kws) => kws.filter((k) => k !== keyword));
    };

    const handleSave = () => {
        if (!keywords.length) setError("Add an keyword!")
        else {
            saveEdgeKeys(edgeId, keywords)
                .then((() => {
                    onSave?.(keywords);
                    setKeywords([]);
                    setEdges(edges.map(e => ({ ...e, label: e.id === edgeId ? keywords.join(', ') : e.label })))
                }))
                .catch()
                .finally(() => onClose())
        }
    };

    const handleClose = () => {
        if (!keywords.length) setError("Add an keyword!")
        else onClose()
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center">
                <DialogPanel className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
                    <DialogTitle className="text-lg font-semibold mb-4">
                        Edit Edge Keywords
                    </DialogTitle>

                    <div className="space-y-2 mb-4">
                        {keywords?.map((kw) => (
                            <div
                                key={kw}
                                className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded"
                            >
                                <span>{kw}</span>
                                <button
                                    onClick={() => removeKeyword(kw)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 mb-2">
                        <Input
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Add keyword..."
                        />
                        <Button onClick={addKeyword}>Add</Button>
                    </div>
                    <div className='text-red-500 text-xs mb-2'>{error}</div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handleSave}>Save</Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default EdgeKeywordModal;