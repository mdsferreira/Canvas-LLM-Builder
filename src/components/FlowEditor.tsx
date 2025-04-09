import ReactFlow, {
    Background, BackgroundVariant, Controls, EdgeChange, MiniMap, NodePositionChange, OnEdgesChange, OnNodesChange, useEdgesState, useNodesState
} from 'reactflow';
import { useContext, useEffect, useState } from 'react';
import { AgentContext, Edge, State, StateType } from '@/lib/context';
import InitialNode from '@/components/flow/initialNode';
import DefaultNode from '@/components/flow/defaultNode';
import FinalNode from '@/components/flow/finalNode';
import 'reactflow/dist/style.css';
import EdgeKeywordModal from './EdgeKeywordModal';
import CustomEdge from './flow/customEdge';
import { saveEdge } from '@/app/api';


const nodeTypes = {
    [StateType.initial]: InitialNode,
    [StateType.default]: DefaultNode,
    [StateType.final]: FinalNode
}
const edgeTypes = {
    buttonedge: CustomEdge,
}

const getStateType = (state: State, edges: Edge[], numStates: number) => {
    if (edges.length < numStates - 1) return StateType.default;
    const stateSources = edges?.filter((e) => e.source === state.id);
    const statetargets = edges?.filter((e) => e.target === state.id)
    if (!stateSources.length && !statetargets?.length) return StateType.default;
    if (stateSources.length && statetargets.length) return StateType.default;
    if (stateSources.length && !statetargets?.length) return StateType.initial;
    if (!stateSources.length && statetargets?.length) return StateType.final;
}

const createNewNode = (state: State, index: number, edges: Edge[], numStates: number) => ({
    id: state.id,
    data: { label: state.name },
    position: state.position || { x: 100, y: 100 + index * 100 },
    type: getStateType(state, edges, numStates),
})
const createNewEdge = (edge: Edge) => ({
    ...edge,
    id: edge.id,
    data: { label: edge.label },
    animated: true,
    type: "buttonedge",
    sourceHandle: `top-${edge.source}`
})

export default function FlowEditor() {
    const { states, edges, setEdges, agent, setStates, setSelectedState } = useContext(AgentContext);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edgesLocal, setLocalEdges, onEdgeChange] = useEdgesState([]);
    const [openEdgeModal, setOpenEdgeModal] = useState(false);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

    //load the saved sates and edges
    useEffect(() => {
        setNodes(states.map((s, idx) => createNewNode(s, idx, edges, states.length)));
        setLocalEdges(edges.map(createNewEdge))
    }, [states, edges, setNodes])

    useEffect(() => {
        if (selectedEdge) setOpenEdgeModal(true)
    }, [selectedEdge])

    const _onNodesChange: OnNodesChange = (changes: NodePositionChange[]) => {
        onNodesChange(changes);
        // Update context with new positions
        if (changes && changes.length) {
            const posChange = changes[0];
            if (posChange.dragging === false) {
                const nodeMoving = nodes.find(n => n.id === posChange.id)
                setStates(states.map(s => s.id === posChange.id ? { ...s, position: nodeMoving.position } : { ...s }));
                setSelectedState(states.find(s => s.id === posChange.id))
            }
        }
    };

    const _onEdgeChange: OnEdgesChange = (changes: EdgeChange[]) => {
        onEdgeChange(changes);
        if (changes.length && changes[0].type === 'select') {
            const edChange = changes[0];
            setSelectedEdge(edges.find(e => e.id === edChange.id))
        }
    };

    const saveNewEdge = (newEdge: Edge) => {
        saveEdge(agent.id, newEdge.source, newEdge.target)
            .then((resp) => {
                const savedEdge = resp.data.edge
                setEdges(edges.concat(savedEdge));
                setSelectedEdge(savedEdge)
            })
            .catch((err) => console.error(err))
    }

    const onConnect = (params) => saveNewEdge(params)

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-gray-300 bg-white">
            <ReactFlow
                nodes={nodes}
                edges={edgesLocal}
                onConnect={onConnect}
                onNodesChange={_onNodesChange}
                onEdgesChange={_onEdgeChange}
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
                        setEdges(edges.map(e => e.id === updated.id ? updated : e))
                    }}
                    onDelete={() => {
                        setEdges(edges.filter(e => e.id !== selectedEdge.id));
                        setSelectedEdge(null)
                    }}
                />)}
        </div>
    );
}
