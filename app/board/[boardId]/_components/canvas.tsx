'use client'

import Info from "./info"
import Participant from "./participants"
import Toolbar from "./toolbar"
import React, { useCallback, useState } from "react"
import { CanvasState, CanvasMode, Camera } from "@/types/canvas"
import { useCanRedo, useCanUndo, useHistory, useMutation } from "@/liveblocks.config"
import CursorsPresence from "./cursorPresence"
import { pointerEventToCanvasPoint } from "@/lib/utils"

interface canvasProps {
    boardId: string
}

const Canvas = ({ boardId }: canvasProps) => {

    const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
    const history = useHistory();
    const canUndo = useCanUndo()
    const canRedo = useCanRedo()


    const onWheelMove = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }))
    }, [])

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        const current = pointerEventToCanvasPoint(e, camera)
        setMyPresence({ cursor: current })
    }, []);

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null })
    }, [])


    return (
        <main className="h-full w-full relative bg-neutral-100 touch-none">
            <Info boardId={boardId} />
            <Participant />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo={canRedo}
                canUndo={canUndo}
                undo={history.undo}
                redo={history.redo}
            />
            <svg className="w-screen h-screen"
                onWheel={onWheelMove}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}>
                <g> <CursorsPresence /> </g>
            </svg>
        </main>
    )
}

export default Canvas