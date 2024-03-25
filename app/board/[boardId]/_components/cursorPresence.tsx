'use client'

import React from 'react'
import { memo } from 'react'

import { useOthersConnectionIds, useOthersMapped } from '@/liveblocks.config'
import Cursor from './Cursor'
import { shallow } from '@liveblocks/client'
import Path from './Path'
import { RGBtoCSS } from '@/lib/utils'

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

const PencilDrafts = () => {
    const others = useOthersMapped((other) => (
        {
            pencilDraft: other.presence.pencilDraft,
            penColor: other.presence.penColor
        }
    ), shallow)

    return <>
        {others.map(([key, other]) => {
            if (other.pencilDraft) {
                return <Path
                    key={key}
                    x={0} y={0}
                    points={other.pencilDraft}
                    fill={other.penColor ? RGBtoCSS(other.penColor) : "#000"}
                />
            }
            return null;
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