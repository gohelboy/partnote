import DropDownActions from "@/components/actions";
import { api } from "@/convex/_generated/api";
import { useAPiMutation } from "@/hooks/use-mutation.api";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation"


interface BoardCardProps {
    id: string;
    title: string;
    authorName: string;
    authorId: string;
    createdAt: number;
    imageUrl: string;
    isFavorited: boolean;
    orgId: string;
}

const BoardCard = ({ id, title, authorName, authorId, createdAt, imageUrl, isFavorited, orgId }: BoardCardProps) => {

    const router = useRouter();

    const { mutate: addFav, pending: addPend } = useAPiMutation(api.board.addToFavorite)
    const { mutate: remFav, pending: remPend } = useAPiMutation(api.board.removeFromFavorite)

    const { userId } = useAuth()
    const authorLabel = userId === authorId ? "You" : authorName
    const createAtLabel = formatDistanceToNow(createdAt, { addSuffix: true })

    const toggleFavorite = (e: any) => {
        e.stopPropagation()
        e.preventDefault();
        if (isFavorited) {
            remFav({ boardId: id }).catch(() => toast.error("Failed to unfavorite"))
        } else {
            addFav({ boardId: id, orgId }).catch(() => toast.error("Failed to Favorite"))
        }
    }

    const openBoard = () => {
        router.push(`/board/${id}`);
    }

    return (
        <div className="group relative h-fit rounded-2xl  overflow-hidden cursor-pointer  transition-outline border hover:shadow-lg  hover:outline-gray-400 hover:outline-dashed" onClick={openBoard}>
            <div className="h-[150px] relative flex-1 bg-amber-100" >
                <Image className="object-cover" src={imageUrl} alt={title} fill />
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-ellipsis max-w-[90%] overflow-hidden">{title}</h4>
                    <button
                        className={cn("opacity-0 group-hover:opacity-100 transition-opacity hover:text-yellow-500")}
                        disabled={remPend || addPend}
                        onClick={(e) => toggleFavorite(e)}>
                        <Star className={cn("h-5 w-5", isFavorited && "fill-yellow-400 stroke-yellow-500")} />
                    </button>
                </div>
                <p className="text-xs transition-opacity opacity-0 group-hover:opacity-100 text-muted-foreground">{authorLabel}, {createAtLabel}</p>
            </div>
            <DropDownActions id={id} title={title} side="bottom" sideOffset={10} >
                <MoreHorizontal className="p-1 absolute top-2 text-muted-foreground right-3 opacity-0 transition-all group-hover:opacity-100 rounded-md hover:bg-slate-800 hover:text-white" />
            </DropDownActions>
        </div>
    )
}

export default BoardCard