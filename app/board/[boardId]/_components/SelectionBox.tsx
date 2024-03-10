'use client'

import { useSelectionBound } from '@/hooks/use-selection-bounds';
import { useSelf, useStorage } from '@/liveblocks.config';
import { LayerType, Side, XYWH } from '@/types/canvas';
import { memo } from 'react'

interface selectionoxProps {
    onPointerDownHandleResize: (corner: Side, InitialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 7;

const SelectionBox = memo(({ onPointerDownHandleResize }: selectionoxProps) => {

    const soleLayerId = useSelf((me) => me.presence.selection.length === 1 ? me.presence.selection[0] : null);
    const isShowingHandle = useStorage((root) => soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path)

    const bounds = useSelectionBound()

    if (!bounds) return null;

    return (
        <>
            <rect
                className='fill-transparent stroke-blue-700 stroke-1 pointer-events-none'
                style={{ transform: `translateX(${bounds.x}px) translateY(${bounds.y}px)` }}
                x={0} y={0} width={bounds.width} height={bounds.height}
            />
            {isShowingHandle && (<>
                <ellipse
                    className='fill-white stroke-blue-700 stroke-1 '
                    x={0} y={0} rx={5} ry={5}
                    style={{
                        cursor: 'nw-resize',
                        transform: `translateX(${bounds.x - HANDLE_WIDTH / 2 + 4}px) translateY(${bounds.y - HANDLE_WIDTH / 2 + 4}px)`
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                />
                <rect
                    className='fill-white stroke-blue-700 stroke-1'
                    x={0} y={0}
                    style={{
                        cursor: 'ns-resize',
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translateX(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px) translateY(${bounds.y - HANDLE_WIDTH / 2}px)`
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                />
                <ellipse
                    className='fill-white stroke-blue-700 stroke-1'
                    x={0} y={0} rx={5} ry={5}
                    style={{
                        cursor: 'ne-resize',
                        transform: `translateX(${bounds.x + bounds.width - HANDLE_WIDTH / 2 + 4}px) translateY(${bounds.y - HANDLE_WIDTH / 2 + 4}px)`
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                />
                <rect
                    className='fill-white stroke-blue-700 stroke-1'
                    x={0} y={0}
                    style={{
                        cursor: 'ew-resize',
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translateX(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px) translateY(${bounds.y + bounds.height / 2 - HANDLE_WIDTH}px)`
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                />
                <ellipse
                    className='fill-white stroke-blue-700 stroke-1'
                    x={0} y={0} rx={5} ry={5}
                    style={{
                        cursor: 'se-resize',
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translateX(${bounds.x + bounds.width - HANDLE_WIDTH / 2 + 4}px) translateY(${bounds.y + bounds.height - HANDLE_WIDTH / 2 + 4}px)`
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                />
                <rect
                    className='fill-white stroke-blue-700 stroke-1'
                    x={0} y={0}
                    style={{
                        cursor: 'ns-resize',
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translateX(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px) translateY(${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                />
                <ellipse
                    className='fill-white stroke-blue-700 stroke-1'
                    x={0} y={0} rx={5} ry={5}
                    style={{
                        cursor: 'sw-resize',
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translateX(${bounds.x - HANDLE_WIDTH / 2 + 4}px) translateY(${bounds.y + bounds.height - HANDLE_WIDTH / 2 + 4}px)`
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                />
                <rect
                    className='fill-white stroke-blue-700 stroke-1'
                    x={0} y={0}
                    style={{
                        cursor: 'ew-resize',
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translateX(${bounds.x - HANDLE_WIDTH / 2}px) translateY(${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                />
            </>)}
        </>
    )
})

SelectionBox.displayName = 'SelectionBox';

export default SelectionBox