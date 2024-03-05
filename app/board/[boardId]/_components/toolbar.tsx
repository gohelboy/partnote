import { Skeleton } from '@/components/ui/skeleton'
import { Circle, MousePointer2, Pencil, Redo2, Square, StickyNote, Type, Undo2 } from 'lucide-react'
import ToolButton from './tool-button'
import { CanvasMode, CanvasState, LayerType } from '@/types/canvas';

interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: Boolean;
    canRedo: Boolean;
};

const Toolbar = ({ canvasState, setCanvasState, undo, redo, canUndo, canRedo }: ToolbarProps) => {
    return (
        <div className='absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-2'>
            <div className='flex flex-col items-center gap-2 bg-white shadow-md p-1 rounded-lg'>
                <ToolButton label='Select' icon={MousePointer2}
                    onClick={() => setCanvasState({ mode: CanvasMode.None })}
                    isActive={
                        canvasState.mode === CanvasMode.None ||
                        canvasState.mode === CanvasMode.Translating ||
                        canvasState.mode === CanvasMode.SelectionNet ||
                        canvasState.mode === CanvasMode.Pressing ||
                        canvasState.mode === CanvasMode.Resizing
                    }
                />
                <ToolButton label='Circle' icon={Circle}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        LayerType: LayerType.Elipse
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Elipse
                    }
                />
                <ToolButton label='Rectangle' icon={Square}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        LayerType: LayerType.Rectangle
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Rectangle
                    }
                />
                <ToolButton label='Text' icon={Type}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        LayerType: LayerType.Text
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Text
                    }
                />
                <ToolButton label='Pencil' icon={Pencil}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Pencil
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Pencil
                    }
                />
                <ToolButton label='Note' icon={StickyNote}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        LayerType: LayerType.Note
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Note
                    }
                />
            </div>
            <div className='flex flex-col items-center gap-2 bg-white shadow-md p-1 rounded-lg'>
                <ToolButton label='Undo' icon={Undo2} onClick={undo} isDisabled={!canRedo} />
                <ToolButton label='Redo' icon={Redo2} onClick={redo} isDisabled={!canUndo} />
            </div>
        </div>
    )
}

export default Toolbar

export const ToolbarSkeleton = () => {
    return <div className='absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-2'>
        <Skeleton className='bg-neutral-200 w-[40px] h-[200px]' />
        <Skeleton className='bg-neutral-200 w-[40px] h-[60px]' />
    </div>
}