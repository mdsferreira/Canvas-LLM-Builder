'use client';

import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import Button from './ui/button';
import Input from './ui/input';
import { deleteEdge, saveEdgeKeys } from '@/app/api';
import { Edge } from '@/lib/context';
import Loading from './ui/loading';
import { Trash2 } from 'lucide-react';

interface EdgeKeywordModalProps {
    edgeId: string;
    initialKeywords: string[];
    isOpen: boolean;
    onClose: () => void;
    onSave?: (edge: Edge) => void;
    onDelete?: () => void
};

const EdgeKeywordModal: React.FC<EdgeKeywordModalProps> = ({ edgeId, initialKeywords, isOpen, onClose, onSave, onDelete }) => {
    const [keywords, setKeywords] = useState(initialKeywords || []);
    const [newKeyword, setNewKeyword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            setLoading(true)
            saveEdgeKeys(edgeId, keywords)
                .then(((resp) => {
                    onSave?.(resp.data.edge);
                    setKeywords([]);
                }))
                .catch((err) => console.error(err))
                .finally(() => {
                    setLoading(false);
                    onClose()
                })
        }
    };

    const handleClose = () => {
        if (!keywords.length) setError("Add an keyword!")
        else onClose()
    }

    const handleDeleteEdge = () => {
        deleteEdge(edgeId)
            .then(((resp) => {
                if (resp.data.success) {
                    onDelete()
                }
            }))
            .catch((err) => console.error(err))
            .finally(() => {
                onClose()
            })
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center">
                <DialogPanel className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
                    <DialogTitle className="text-lg font-semibold flex items-center justify-between w-full mb-2 ">
                        Edit Edge Keywords
                        <Button variant="ghost" className="flex gap-2 items-center" onClick={handleDeleteEdge}>
                            <Trash2 color='red' size={15} /> Delete Edge
                        </Button>

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
                        <Button variant="success" onClick={handleSave}>
                            {loading ? <div className='flex gap-2'>Saving...<Loading /></div> : "Save"}
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default EdgeKeywordModal;