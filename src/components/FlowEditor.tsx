import ReactFlow, { addEdge, Background, BackgroundVariant, Controls, Edge, MiniMap, NodePositionChange, OnNodesChange, useEdgesState, useNodesState } from 'reactflow';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { AgentContext, StateType } from '@/lib/context';
import InitialNode from '@/components/flow/initialNode';
import DefaultNode from '@/components/flow/defaultNode';
import FinalNode from '@/components/flow/finalNode';
import 'reactflow/dist/style.css';

const createNewNode = (state, index) => ({
    id: state.stateId || state.id,
    data: { label: state.name },
    position: state.position || { x: 100, y: 100 + index * 100 },
    type: index === 0 ? StateType.initial : StateType.default,
})
const createNewEdge = (edge) => ({
    ...edge,
    id: edge.edgeId || edge.id,
    animated: true,
    sourceHandle: 'bot'
})

export default function FlowEditor() {
    const { states, edges, setEdges, setStates } = useContext(AgentContext);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edgesLocal, setLocalEdges, onEdgeChange] = useEdgesState([]);

    const onAdd = useCallback(() => {
        setNodes(states.map(createNewNode));
    }, [setNodes, states]);

    useEffect(() => {
        if (states.length > 0 && states.length > nodes.length) {
            if (nodes.length > 1) {
                const nodePos = nodes[nodes.length - 1].position
                states[states.length - 1].position = { x: nodePos.x, y: nodePos.y + 100 }
                setStates(states)
            }
            onAdd()
        }
    }, [states])

    useEffect(() => {
        if (nodes.length && !edgesLocal.length && edges && edges.length) {
            setLocalEdges(edges.map(createNewEdge))
        }
    }, [edges, nodes])

    const _onNodesChange: OnNodesChange = (changes) => {
        const updatedNodes = onNodesChange(changes);
        // Update context with new positions
        if (changes && changes.length && changes[0].dragging) {
            const posChange: NodePositionChange = changes[0];
            if (posChange.position) {
                const updated = states.find((s) => s.stateId === posChange.id);
                updated.position = posChange.position;
                setStates(states);
            }
        }
    };

    const onConnect = useCallback(
        (params) =>
            setEdges((eds: Edge[]) =>
                addEdge({ ...params, animated: true }, eds),
            ),
        [edges],
    );

    const nodeTypes = useMemo(() => ({ [StateType.initial]: InitialNode, [StateType.default]: DefaultNode, [StateType.final]: FinalNode }), []);

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
            >
                <MiniMap />
                <Controls />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
