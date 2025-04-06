import React from "react";
import { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import { Flag } from 'lucide-react';

const InitialNode: React.ComponentType<NodeProps> = (props) => {
  const { data } = props;
  return (
    <>
      <div className="flex items-center flex-center p-1 text-[8px] rounded-t-xs border border-b-0 border-black border-solid  w-20 bg-white">
        <Flag size={8} className="text-green-500 mr-1" />Initial State
      </div>
      <div className="p-2 rounded-b-xs border border-black border-solid text-center w-40 bg-white">
        <label htmlFor="text">{data.label}</label>
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable
          id="bot"
        />
      </div>
    </>
  )
}

export default InitialNode;