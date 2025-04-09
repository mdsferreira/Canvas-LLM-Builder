import * as React from 'react';
import { cn } from '@/lib/utils';


export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => (
        <input
            ref={ref}
            className={cn(
                'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
                className
            )}
            {...props}
        />
    )
);
Input.displayName = 'Input';

export default Input;