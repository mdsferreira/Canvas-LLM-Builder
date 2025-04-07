import { Loader } from 'lucide-react'
import React from 'react'

type Props = {}

export default function Loading({ }: Props) {
    return (<Loader className='animate-spin' />)
}