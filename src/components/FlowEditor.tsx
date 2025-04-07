import ReactFlow, {
    Background, BackgroundVariant, Controls, MiniMap, NodePositionChange, OnNodesChange, useEdgesState, useNodesState
} from 'reactflow';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AgentContext, Edge, StateType } from '@/lib/context';
import InitialNode from '@/components/flow/initialNode';
import DefaultNode from '@/components/flow/defaultNode';
import FinalNode from '@/components/flow/finalNode';
import 'reactflow/dist/style.css';
import EdgeKeywordModal from './EdgeKeywordModal';
import CustomEdge from './flow/customEdge';
import { saveEdge } from '@/app/api/agent';


const nodeTypes = {
    [StateType.initial]: InitialNode,
    [StateType.default]: DefaultNode,
    [StateType.final]: FinalNode
}
const edgeTypes = {
    buttonedge: CustomEdge,
}

const createNewNode = (state, index, last) => ({
    id: state.id,
    data: { label: state.name },
    position: state.position || { x: 100, y: 100 + index * 100 },
    type: index === 0 ? StateType.initial : last ? StateType.final : StateType.default,
})
const createNewEdge = (edge) => ({
    ...edge,
    id: edge.id,
    data: { label: edge.label },
    animated: true,
    type: "buttonedge",
    sourceHandle: `top-${edge.source}`
})

export default function FlowEditor() {
    const { states, edges, setEdges, agent, setStates } = useContext(AgentContext);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edgesLocal, setLocalEdges, onEdgeChange] = useEdgesState([]);
    const [openEdgeModal, setOpenEdgeModal] = useState(false);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

    //load the saved sates
    useEffect(() => {
        setNodes(states.map((s, idx) => createNewNode(s, idx, idx === states.length - 1)));
    }, [states])

    //load the saved edges
    useEffect(() => {
        // if (nodes.length && !edgesLocal.length && edges && edges.length) {
        setLocalEdges(edges.map(createNewEdge))
        // }
    }, [edges])

    useEffect(() => {
        if (selectedEdge) setOpenEdgeModal(true)
    }, [selectedEdge])

    const _onNodesChange: OnNodesChange = (changes: NodePositionChange[]) => {
        const updatedNodes = onNodesChange(changes);
        // Update context with new positions
        if (changes && changes.length && changes[0].dragging) {
            const posChange = changes[0];
            if (posChange.position) {
                const updated = states.find((s) => s.id === posChange.id);
                updated.position = posChange.position;
                setStates(states);
            }
        }
    };

    const saveNewEdge = (newEdge) => {
        saveEdge(agent.id, newEdge.source, newEdge.target)
            .then((resp) => {
                const savedEdge = resp.data.edge
                setLocalEdges(edgesLocal.concat(createNewEdge(savedEdge)))
                setEdges(edges.concat(savedEdge));
                setSelectedEdge(savedEdge)
            })
            .catch()
    }

    const onConnect = useCallback((params) => {
        saveNewEdge(params)
    }, [edgesLocal]);

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-gray-300 bg-white">
            <ReactFlow
                nodes={nodes}
                edges={edgesLocal}
                onConnect={onConnect}
                onNodesChange={_onNodesChange}
                onEdgesChange={onEdgeChange}
                fitView
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
            >
                <MiniMap />
                <Controls />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
            {selectedEdge && (
                <EdgeKeywordModal
                    isOpen={openEdgeModal}
                    edgeId={selectedEdge.id}
                    initialKeywords={selectedEdge.keywords}
                    onClose={() => setOpenEdgeModal(false)}
                    onSave={(updated) => {
                        // Update AgentContext or re-fetch edges
                    }}
                />)}
        </div>
    );
}
