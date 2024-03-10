'use client'

import React from 'react'
import { memo } from 'react'
import { MousePointer2 } from 'lucide-react'
import { connectionIdColor } from '@/lib/utils'
import { useOther } from '@/liveblocks.config'

interface CursorProps {
    connectionId: number
}

const Cursor = memo(({ connectionId }: CursorProps) => {
    const other = useOther(connectionId, (user) => user?.info);
    const cursor = useOther(connectionId, (user) => user.presence.cursor)
    const name = other?.name || other?.username || "Memeber"
    if (!cursor) return
    const { x, y } = cursor;
    return (
        <foreignObject
            height={50} width={name.length * 10 + 24}
            className='relative drop-shadow-md'
            style={{
                transform: `translateX(${x}px) translateY(${y}px)`
            }}>
            <MousePointer2 className='h-5 w-5' style={{ fill: connectionIdColor(connectionId), color: connectionIdColor(connectionId) }} />
            <div className='absolute rounded-md text-white text-xs left-4 bottom-3 p-1 select-none' style={{ backgroundColor: connectionIdColor(connectionId) }}>{name}</div>
        </foreignObject>
    )
})

Cursor.displayName = 'Cursor'

export default Cursor