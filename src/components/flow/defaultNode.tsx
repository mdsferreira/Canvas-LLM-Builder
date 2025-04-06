import React from "react";
import { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';

const DefaultNode: React.ComponentType<NodeProps> = (props) => {
  const { data } = props;
  return (
    <div className="p-2 rounded-xs border border-black border-solid text-center w-40 bg-white">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable
        id="top"
      />
      <label htmlFor="text">{data.label}</label>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable
        id="bot"
      />
    </div>
  )
}

export default DefaultNode;