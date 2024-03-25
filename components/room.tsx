'use client'
import { LiveMap, LiveList, LiveObject } from "@liveblocks/client"
import { Layer } from "@/types/canvas"
import { ReactNode } from "react"
import { RoomProvider } from "@/liveblocks.config"
import { ClientSideSuspense } from "@liveblocks/react"

interface roomProps {
    children: ReactNode
    roomId: string
    fallback: NonNullable<ReactNode> | null
}

const Room = ({ children, roomId, fallback }: roomProps) => {
    return (
        <RoomProvider id={roomId}
            initialPresence={{ cursor: null, selection: [], pencilDraft: null, penColor: null }}
            initialStorage={{
                layers: new LiveMap<string, LiveObject<Layer>>(),
                layerIds: new LiveList()
            }}>
            <ClientSideSuspense fallback={fallback}>
                {() => children}
            </ClientSideSuspense>
        </RoomProvider>
    )
}

export default Room