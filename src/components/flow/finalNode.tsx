import React from "react";
import { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import { CircleDot } from 'lucide-react';

const FinalNode: React.ComponentType<NodeProps> = (props) => {
  const { data } = props;
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable
      />
      <div className="p-2 rounded-t-xs border border-black border-solid text-center w-40 bg-white">
        <label htmlFor="text">{data.label}</label>
      </div>
      <div className="flex items-center flex-center p-1 text-[8px] rounded-b-xs border border-t-0 border-black border-solid  w-20 bg-white">
        <CircleDot size={8} className="text-red-500 mr-1" />Final State
      </div>
    </>
  )
}

export default FinalNode;