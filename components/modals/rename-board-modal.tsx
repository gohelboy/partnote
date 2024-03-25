import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogClose, DialogTitle } from "../ui/dialog";
import { useRenameModal } from "@/store/useRename-modal";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useAPiMutation } from "@/hooks/use-mutation.api";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Image from "next/image";

const RenameBoardModal = () => {
    const { isOpen, onClose, initialValues } = useRenameModal();
    const [title, setTitle] = useState(initialValues.title);


    const { mutate, pending } = useAPiMutation(api.board.updateBoardName);

    const updateBoardName = () => {
        mutate({ id: initialValues.id, title: title })
            .then(() => toast.success("Board renamed"))
            .catch((e) => toast.error(e.message)).finally(() => onClose());
    }

    useEffect(() => {
        setTitle(initialValues.title);
    }, [initialValues.title]);


    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent >
                <DialogHeader className="outline-none">
                    <DialogTitle>Edit board title</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Enter a new title for this board
                </DialogDescription>
                <Input placeholder="Enter board title" value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} required />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button disabled={pending} onClick={updateBoardName}>
                        {pending ? <Image src="/logoWhite.png" className='animate-spin duration-1000' width={20} height={20} alt="loading" /> : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default RenameBoardModal;
