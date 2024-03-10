'use client'

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useAPiMutation } from "@/hooks/use-mutation.api"
import { useOrganization } from "@clerk/nextjs"
import { Pencil } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"

const NewBoardButton = () => {
    const router = useRouter();
    const { organization } = useOrganization();

    const { mutate, pending } = useAPiMutation(api.board.create)

    const onclick = () => {
        if (!organization) return;
        mutate({
            orgId: organization.id,
            title: 'untitle',
        }).then((id) => {
            toast.success("Board Created")
            router.push(`/board/${id}`);
        }).catch((err) => { toast.error("Failed to create board!"); });
    }
    return (
        <Button className="h-full min-h-[240px] flex flex-col gap-2 rounded-2xl" onClick={onclick}>
            {pending ?
                <Image src="/logoWhite.png" width={35} height={35} alt="loading" className="animate-spin duration-1000" />
                : <> <Pencil /> <span>New Board</span> </>}
        </Button>
    )
}

export default NewBoardButton