'use client'

import Info from "./info"
import Participant from "./participants"
import Toolbar from "./toolbar"
import { useState } from "react"
import { CanvasState, CanvasMode } from "@/types/canvas"
import { useCanRedo, useCanUndo, useHistory } from "@/liveblocks.config"


interface canvasProps {
    boardId: string
}

const Canvas = ({ boardId }: canvasProps) => {

    const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });


    const history = useHistory();
    const canUndo = useCanUndo()
    const canRedo = useCanRedo()

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
        </main>
    )
}

export default Canvas