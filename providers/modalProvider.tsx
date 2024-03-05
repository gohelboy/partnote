'use client'

import { useEffect, useState } from "react"
import RenameBoardModal from "@/components/modals/rename-board-modal"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true) }, [])
    if (!isMounted) return null;;
    return (
        <>
            <RenameBoardModal />
        </>
    )
}