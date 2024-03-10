"use client"

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useAPiMutation } from '@/hooks/use-mutation.api';
import { useOrganization } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { toast } from 'sonner';
import BoardCard from './board-card';
import NewBoardButton from './new-board-button';
import { useRouter } from 'next/navigation';

interface BoardListProps {
    orgId: string,
    query: {
        search?: string,
        favorites?: string,
    }
}

const BoardList = ({ orgId, query }: BoardListProps) => {

    const router = useRouter();
    const boards = useQuery(api.boards.get, { orgId, ...query });
    const { organization } = useOrganization();

    const { mutate, pending } = useAPiMutation(api.board.create);

    const createNewBoard = () => {
        if (!organization) return;
        mutate({
            orgId: organization.id,
            title: 'untitle',
        })
            .then((id) => {
                toast.success("Board Created");
                router.push(`/board/${id}`)
            })
            .catch((err) => { toast.error("Failed to create board!"); });
    }

    if (boards === undefined) {
        return <div className='h-full flex items-center justify-center'>
            <Image className='animate-ping duration-1000' width={70} height={70} src="/logo.svg" alt='favorite' />
        </div>
    }

    if (!boards.length && query.search) {
        return <div className='h-full flex flex-col items-center justify-center'>
            <Image width={150} height={150} src="/notFoundBoard.png" alt='favorite' />
            <h2 className='text-2xl font-semibold mt-2'>Not Found</h2>
            <p className='text-sm text-muted-foreground'>Searched board does not exists</p>
        </div>
    }
    if (!boards.length && query.favorites) {
        return <div className='h-full flex flex-col items-center justify-center'>
            <Image width={120} height={120} src="/addToFavorite.png" alt='favorite' />
            <h2 className='text-2xl font-semibold mt-2'>Favorites</h2>
            <p className='text-sm text-muted-foreground'>Add board to favorite to list here.</p>
        </div>
    }
    if (!boards.length) {
        return <div className='h-full flex flex-col items-center justify-center'>
            <Image width={200} height={200} src="/createBoard.png" alt='favorite' />
            <h2 className='text-2xl font-semibold mt-2'>Create Your first board!</h2>
            <p className='text-sm text-muted-foreground'>Start by creating a board for your organization</p>
            <Button className='mt-3' disabled={pending} onClick={createNewBoard}>
                {pending ? <Image className=' animate-spin duration-1000' src="/logoWhite.png" width={20} height={20} alt='loading' /> : "Create a board"}
            </Button>
        </div>
    }

    return (
        <div className='@container h-full flex-col overflow-auto p-6'>
            <h2 className='text-3xl font-semibold'>{query.favorites ? "Favorite Boards" : "Team Boards"}</h2>
            <div className='grid gap-4 @[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  grid-flow-row mt-6 pb-10'>
                <NewBoardButton />
                {boards.map((board) => {
                    return <BoardCard
                        key={board._id}
                        id={board._id}
                        title={board.title}
                        authorId={board.authorId}
                        imageUrl={board.imageUrl}
                        authorName={board.authorName}
                        createdAt={board._creationTime}
                        isFavorited={board.isFavorite}
                        orgId={orgId}
                    />
                })}
            </div>
        </div>
    )
}

export default BoardList