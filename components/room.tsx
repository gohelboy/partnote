'use client'

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
        <RoomProvider id={roomId} initialPresence={{
            cursor: null,
        }}>
            <ClientSideSuspense fallback={fallback}>
                {() => children}
            </ClientSideSuspense>
        </RoomProvider>
    )
}

export default Room