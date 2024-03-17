'use client'

import { connectionIdColor, findIntersectingLayersWithRectangle, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
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
import SelectionTool from "./selectiontool";

const MAX_LAYERS = 100;
const SELECTION_NET_THRESOLD = 5

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

    const unSelectLayer = useMutation(({ self, setMyPresence }) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true });
        }

    }, [])

    const onPointerUp = useMutation(({ }, e) => {
        const point = pointerEventToCanvasPoint(e, camera);


        if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing) {

            unSelectLayer()
            setCanvasState({ mode: CanvasMode.None })
        } else if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.LayerType, point);
        } else {
            setCanvasState({
                mode: CanvasMode.None,
            })
        }

        history.resume();
    }, [camera, canvasState, history, insertLayer, unSelectLayer])

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        const point = pointerEventToCanvasPoint(e, camera);
        if (canvasState.mode === CanvasMode.Inserting) return;
        setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    }, [camera, canvasState.mode, setCanvasState])


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

    const resizeSelectedLayer = useMutation(({ storage, self }, point: Point,) => {
        if (canvasState.mode !== CanvasMode.Resizing) return;
        const bounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point)
        const liveLayers = storage.get("layers")
        const layer = liveLayers.get(self.presence.selection[0]);
        if (layer) {
            layer.update(bounds);
        }
    }, [canvasState])

    const startMultiSelection = useCallback((current: Point, origin: Point) => {
        if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > SELECTION_NET_THRESOLD) {
            setCanvasState({ mode: CanvasMode.SelectionNet, origin, current })
        }
    }, [])

    const translateSelectedLayer = useMutation(({ storage, self }, point: Point) => {
        if (canvasState.mode !== CanvasMode.Translating) return;
        const offset = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y,
        }

        const liveLayers = storage.get("layers");
        for (const id of self.presence.selection) {
            const layer = liveLayers.get(id);
            if (layer) {
                layer.update({
                    x: layer.get("x") + offset.x,
                    y: layer.get("y") + offset.y,
                })
            }
        }
        setCanvasState({ mode: CanvasMode.Translating, current: point })
    }, [canvasState])

    const updateSelectionNet = useMutation(({ storage, setMyPresence }, current: Point, origin: Point) => {
        const layers = storage.get("layers").toImmutable();
        setCanvasState({ mode: CanvasMode.SelectionNet, current, origin })
        const ids = findIntersectingLayersWithRectangle(layerIds, layers, origin, current);
        setMyPresence({ selection: ids });
    }, [layerIds])

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        setCamera(prevCamera => {
            const current = pointerEventToCanvasPoint(e, prevCamera)
            setMyPresence({ cursor: current });
            return prevCamera;
        });

        const current = pointerEventToCanvasPoint(e, camera)

        if (canvasState.mode === CanvasMode.Pressing) {
            startMultiSelection(current, canvasState.origin);
        } else if (canvasState.mode === CanvasMode.SelectionNet) {
            updateSelectionNet(current, canvasState.origin);
        } else if (canvasState.mode === CanvasMode.Translating) {
            translateSelectedLayer(current)
        } else if (canvasState.mode === CanvasMode.Resizing) {
            resizeSelectedLayer(current)
        }


    }, [canvasState, resizeSelectedLayer, camera, translateSelectedLayer]);

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
            <SelectionTool camera={camera} setLastUsedColor={setLastUsedColor} />
            <svg className="w-screen h-screen"
                onWheel={onWheelMove}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}>
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
                    {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null &&
                        <rect className="fill-blue-600/5 stroke-blue-600 stroke-1"
                            x={Math.min(canvasState.origin.x, canvasState.current.x)}
                            y={Math.min(canvasState.origin.y, canvasState.current.y)}
                            width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                            height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                        />
                    }
                    <CursorsPresence />
                </g>
            </svg>
        </main>
    )
}

export default Canvas