'use client'

import React from 'react'
import { memo } from 'react'

import { useOthersConnectionIds } from '@/liveblocks.config'
import Cursor from './Cursor'

const Cursors = () => {
    const cursorIDs = useOthersConnectionIds();
    return <>
        {cursorIDs.map((connectionId) => {
            return <Cursor
                key={connectionId}
                connectionId={connectionId}
            />
        })}
    </>
}


const CursorsPresence = memo(() => {
    return <>
        <Cursors />
    </>
})

CursorsPresence.displayName = 'CursorsPresence'

export default CursorsPresence