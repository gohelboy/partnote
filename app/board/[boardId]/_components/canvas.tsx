'use client'

import { connectionIdColor, pointerEventToCanvasPoint } from "@/lib/utils";
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useStorage } from "@/liveblocks.config";
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH } from "@/types/canvas";
import { LiveObject } from "@liveblocks/client";
import { nanoid } from 'nanoid';
import React, { useCallback, useMemo, useState } from "react";
import LayerPreview from "./LayerPreview";
import CursorsPresence from "./cursorPresence";
import Info from "./info";
import Participant from "./participants";
import Toolbar from "./toolbar";
import SelectionBox from "./SelectionBox";

const MAX_LAYERS = 100;

interface canvasProps {
    boardId: string
}

const Canvas = ({ boardId }: canvasProps) => {
    const layerIds = useStorage((root) => root.layerIds);
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None
    });
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 0,
        g: 0,
        b: 0
    });
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();


    const insertLayer = useMutation((
        { storage, setMyPresence },
        layerType: LayerType.Elipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
        position: Point
    ) => {

        const liveLayers = storage.get("layers")
        if (liveLayers.size >= MAX_LAYERS) {
            return;
        }

        const liveLayerIds = storage.get("layerIds")
        const layerID = nanoid()
        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            fill: lastUsedColor,
        })
        liveLayerIds.push(layerID);
        liveLayers.set(layerID, layer);
        setMyPresence({ selection: [layerID] }, { addToHistory: true });
        setCanvasState({ mode: CanvasMode.None })
    }, [lastUsedColor])


    const onPointerUp = useMutation(({ }, e) => {
        const point = pointerEventToCanvasPoint(e, camera);
        if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.LayerType, point);
        } else {
            setCanvasState({
                mode: CanvasMode.None,
            })
        }

        history.resume();
    }, [camera, canvasState, history, insertLayer])


    const onPointerDownHandleResize = useCallback((corner: Side, initialBounds: XYWH) => {
        history.pause();
        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds,
            corner,
        })

    }, [history])

    const onWheelMove = useCallback((e: React.WheelEvent) => {
        setCamera((prevCamera) => ({
            x: prevCamera.x - e.deltaX,
            y: prevCamera.y - e.deltaY,
        }));
    }, [])

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        setCamera(prevCamera => {
            const current = pointerEventToCanvasPoint(e, prevCamera)
            setMyPresence({ cursor: current });
            return prevCamera;
        });
    }, []);

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null })
    }, [])

    const onLayerPointerDown = useMutation((
        { self, setMyPresence },
        e: React.PointerEvent,
        layerId: string,
    ) => {
        if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) return
        history.pause();
        e.stopPropagation();

        const point = pointerEventToCanvasPoint(e, camera)
        if (!self.presence.selection.includes(layerId)) {
            setMyPresence({ selection: [layerId] }, { addToHistory: true });
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point });
    }, [setCanvasState, camera, history, canvasState])

    const selections = useOthersMapped((other) => other.presence.selection);
    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};
        for (const user of selections) {
            const [connectionId, selection] = user;
            for (const layerid of selection) {
                layerIdsToColorSelection[layerid] = connectionIdColor(connectionId)
            }
        }
        return layerIdsToColorSelection;
    }, [selections])

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
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}>
                <g
                    style={{ transform: `translateX(${camera.x}px) translateY(${camera.y}px)` }}>
                    {layerIds.map((layerId) => (
                        <LayerPreview
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layerIdsToColorSelection[layerId]}
                        />
                    ))}
                    <SelectionBox onPointerDownHandleResize={onPointerDownHandleResize} />
                    <CursorsPresence />
                </g>
            </svg>
        </main>
    )
}

export default Canvas