import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu"
import React from "react"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import { Link2, PenLine, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useAPiMutation } from "@/hooks/use-mutation.api"
import { api } from "@/convex/_generated/api"
import ConfirmDialogModal from "./confirm-dialog-modal"
import { Button } from "./ui/button"
import { useRenameModal } from "@/store/useRename-modal"


interface ActionProps {
    children: React.ReactNode,
    side: DropdownMenuContentProps["side"]
    sideOffset: DropdownMenuContentProps["sideOffset"]
    id: string
    title: string
}

const DropDownActions = ({ children, side, sideOffset, id, title }: ActionProps) => {
    const { onOpen } = useRenameModal();


    const openRenameModal = () => {
        onOpen(id, title)
    }

    const { mutate, pending } = useAPiMutation(api.board.remove);

    const onCopyLink = () => {
        const link = `${window.location.origin}/board/${id}`;
        navigator.clipboard.writeText(link)
            .then((res) => { toast.success("Board link copied") })
            .catch((error) => { toast.error("failed to copy board link") });
    }
    const deleteBoard = () => {
        mutate({ id: id })
            .then((res) => { toast.success(`${title} board deleted`) })
            .catch((error) => { toast.error(`failed to delete ${title} board`) });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()} side={side} sideOffset={sideOffset}>
                <DropdownMenuItem className="cursor-pointer flex gap-2 items-center" onClick={onCopyLink}>
                    <Link2 className="h4 w-4" />
                    <span className="text-xs"> Copy link </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex gap-2 items-center" onClick={openRenameModal}>
                    <PenLine className="h4 w-4" />
                    <span className="text-xs"> Rename </span>
                </DropdownMenuItem>
                <ConfirmDialogModal
                    disabled={pending}
                    header="Delete board?"
                    onConfirm={deleteBoard}
                    description={`This action will delete the board "${title}" and all its data are you sure want to delete this?`} >
                    <Button size="sm" variant="ghost" className="w-full cursor-pointer flex justify-start px-2 gap-x-2 text-red-600" >
                        <Trash2 className="w-4" />
                        <span className="text-xs"> Delete </span>
                    </Button>
                </ConfirmDialogModal>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropDownActions