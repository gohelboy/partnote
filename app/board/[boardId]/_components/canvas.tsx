'use client'

import { connectionIdColor, findIntersectingLayersWithRectangle, penPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds, RGBtoCSS } from "@/lib/utils";
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useSelf, useStorage } from "@/liveblocks.config";
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH } from "@/types/canvas";
import { LiveObject } from "@liveblocks/client";
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import LayerPreview from "./LayerPreview";
import CursorsPresence from "./cursorPresence";
import Info from "./info";
import Participant from "./participants";
import Toolbar from "./toolbar";
import SelectionBox from "./SelectionBox";
import SelectionTool from "./selectiontool";
import Path from "./Path";
import useDisableScrollBounce from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

const MAX_LAYERS = 100;
const SELECTION_NET_THRESOLD = 5;

interface canvasProps {
    boardId: string;
}

const Canvas = ({ boardId }: canvasProps) => {
    const layerIds = useStorage((root) => root.layerIds);
    const pencilDrafts = useSelf((me) => me.presence.pencilDraft)
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
    const deleteLayers = useDeleteLayers();
    useDisableScrollBounce()




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

    const continueDrawing = useMutation(({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
        const { pencilDraft } = self.presence;
        if (canvasState.mode !== CanvasMode.Pencil || pencilDraft == null) return;
        setMyPresence({
            cursor: point,
            pencilDraft: pencilDraft.length === 1 &&
                pencilDraft[0][0] === point.x &&
                pencilDraft[0][1] === point.y
                ? pencilDraft : [...pencilDraft, [point.x, point.y, e.pressure]]
        })

    }, [canvasState.mode])

    const insertPath = useMutation(({ storage, self, setMyPresence }) => {
        const liveLayers = storage.get("layers");
        const { pencilDraft } = self.presence;
        if (pencilDraft == null || pencilDraft.length < 2 || liveLayers.size >= MAX_LAYERS) {
            setMyPresence({ pencilDraft: null });
            return;
        };
        const id = nanoid();
        liveLayers.set(id, new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor)));

        const liveLayerIds = storage.get("layerIds");
        liveLayerIds.push(id);
        setMyPresence({ pencilDraft: null });
        setCanvasState({ mode: CanvasMode.Pencil })
    }, [lastUsedColor])

    const startDrawing = useMutation(({ setMyPresence }, point: Point, pressure: number) => {
        setMyPresence({
            pencilDraft: [[point.x, point.y, pressure]],
            penColor: lastUsedColor,
        })

    }, [lastUsedColor])

    const onPointerUp = useMutation(({ }, e) => {
        const point = pointerEventToCanvasPoint(e, camera);


        if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing) {
            unSelectLayer()
            setCanvasState({ mode: CanvasMode.None })
        } else if (canvasState.mode === CanvasMode.Pencil) {
            insertPath()
        } else if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.LayerType, point);
        } else {
            setCanvasState({
                mode: CanvasMode.None,
            })
        }

        history.resume();
    }, [camera, canvasState, history, setCanvasState, insertLayer, unSelectLayer, insertPath])

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Inserting) return;
        if (canvasState.mode === CanvasMode.Pencil) {
            startDrawing(point, e.pressure)
            return
        };

        setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    }, [camera, canvasState.mode, setCanvasState, startDrawing])


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
        } else if (canvasState.mode === CanvasMode.Pencil) {
            continueDrawing(current, e)
        }


    }, [canvasState,
        camera,
        startMultiSelection,
        updateSelectionNet,
        translateSelectedLayer,
        resizeSelectedLayer,
        continueDrawing]);

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
    }, [selections]);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
                history.undo();
            } else if ((e.key === "y" && (e.ctrlKey || e.metaKey)) || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
                history.redo();
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                deleteLayers()
            }

            if (e.key === 'v') {
                setCanvasState({ mode: CanvasMode.None })
            }

        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [deleteLayers, history])

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
                    {pencilDrafts != null && pencilDrafts.length > 0 && <Path
                        points={pencilDrafts}
                        fill={RGBtoCSS(lastUsedColor)}
                        x={0} y={0}
                    />}
                </g>
            </svg>
        </main>
    )
}

export default Canvas