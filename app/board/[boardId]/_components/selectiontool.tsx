'use client'
import { useSelectionBound } from '@/hooks/use-selection-bounds'
import { useMutation, useSelf } from '@/liveblocks.config'
import { Camera, Color } from '@/types/canvas'
import React, { memo } from 'react'
import ColorPicker from './color-picker'
import { useDeleteLayers } from '@/hooks/use-delete-layers'
import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import { BringToFront, SendToBack, Trash2 } from 'lucide-react'
interface SelectionToolProps {
    camera: Camera
    setLastUsedColor: (color: Color) => void
}

const SelectionTool = memo(({ camera, setLastUsedColor }: SelectionToolProps) => {

    const selection = useSelf((me) => me.presence.selection);


    const setFill = useMutation(({ storage }, fill: Color) => {
        const liveLayers = storage.get("layers");
        setLastUsedColor(fill);

        selection.forEach((id) => {
            liveLayers.get(id)?.set("fill", fill);
        })
    }, [selection, setLastUsedColor]);


    const moveToBack = useMutation(({ storage }) => {
        const liveLayersIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayersIds.toArray();

        for (let i = 0; i < arr.length; i++) {
            if (selection.includes(arr[i])) {
                indices.push(i);
            }
        }

        for (let i = 0; i < indices.length; i++) {
            liveLayersIds.move(indices[i], i);
        }

    }, [selection])

    const moveToFront = useMutation(({ storage }) => {
        const liveLayersIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayersIds.toArray();

        for (let i = 0; i < arr.length; i++) {
            if (selection.includes(arr[i])) {
                indices.push(i);
            }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
            liveLayersIds.move(indices[i], arr.length - 1 - (indices.length - 1 - i));
        }

    }, [selection])

    const deleteLayers = useDeleteLayers();


    const selectionBounds = useSelectionBound()
    if (!selectionBounds) return null;

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
        <div
            className='duration-100 absolute p-3 bg-white select-none rounded-lg shadow-sm border flex from-opacity-0 to-opacity-100'
            style={{ transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))` }}>
            <ColorPicker onChange={setFill} />

            <div className='flex flex-col'>
                <Hint label='Bring to front' side='top' sideOffset={16}>
                    <Button variant="ghost" size={"icon"} onClick={moveToFront}>
                        <BringToFront />
                    </Button>
                </Hint>
                <Hint label='Send to back' side='bottom' sideOffset={16}>
                    <Button variant="ghost" size={"icon"} onClick={moveToBack}>
                        <SendToBack />
                    </Button>
                </Hint>

            </div>

            <div className='flex items-center pl-2 ml-2 border-l border-neutral-200'>
                <Hint label='Delete' side='top' sideOffset={10}>
                    <Button variant="ghost" size={"icon"} onClick={deleteLayers}>
                        <Trash2 />
                    </Button>
                </Hint>
            </div>
        </div>
    )
})

SelectionTool.displayName = 'SelectionTool'

export default SelectionTool