'use client'
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { Hint } from '@/components/hint';
import { Input } from '@/components/ui/input';
import { useAPiMutation } from '@/hooks/use-mutation.api';

import { toast } from 'sonner';
import { MoreVertical } from 'lucide-react';
import DropDownActions from '@/components/actions';


const TabSeparator = () => {
    return <div className='text-neutral-300 px-1 select-none'>|</div>
}

interface InfoProps {
    boardId: string;
}

const Info = ({ boardId }: InfoProps) => {

    const data = useQuery(api.board.get, { id: boardId as Id<"boards"> });

    const [editBoardName, setEditBoardName] = useState(false);
    const [newBoardName, setBoardName] = useState(data?.title);
    const { mutate, pending } = useAPiMutation(api.board.updateBoardName);

    const updateBoardName = () => {
        if (newBoardName?.trim() === data?.title || newBoardName?.trim() === "") {
            setBoardName(data?.title);
            setEditBoardName(false);
            return
        }
        mutate({ id: boardId, title: newBoardName })
            .then(() => toast.success(`Board renamed to ${newBoardName}`))
            .catch((e) => toast.error(e.message)).finally(() => setEditBoardName(false));
    }

    useEffect(() => { setBoardName(data?.title) }, [data?.title])


    if (!data) return <InfoSkeleton />
    return (
        <div className='absolute top-2 left-2 bg-white rounded-lg shadow-md px-2 h-12 flex items-center justify-center'>
            <Hint label='Go To Boards' side='bottom' sideOffset={10}>
                <Button variant="ghost" size={"icon"} >
                    <Link href={"/"} className='flex select-none items-center justify-center gap-1'>
                        <Image src="/icon.svg" width={34} height={34} alt='partnote logo' className='pt-1' />
                    </Link>
                </Button>
            </Hint>
            <TabSeparator />


            {editBoardName ? <div className='flex align-center justify-center gap-1'>
                <Input value={newBoardName} onChange={(e) => setBoardName(e.target.value)} />
                <Button variant={"outline"} onClick={updateBoardName} disabled={pending}>Save</Button>
            </div> : <Hint label='Edit' side='bottom' sideOffset={10}>
                <Button className='font-semibold select-none' variant={"ghost"} onClick={() => setEditBoardName(true)}>
                    {data.title}
                </Button>
            </Hint>}

            <TabSeparator />

            <DropDownActions id={data._id} title={data.title} side="bottom" sideOffset={10} >
                <div>
                    <Hint side='bottom' sideOffset={10} label='Menu'>
                        <Button size={"icon"} variant={"ghost"}>
                            <MoreVertical />
                        </Button>
                    </Hint>
                </div>
            </DropDownActions>

        </div>
    )
}

export default Info


export const InfoSkeleton = () => {
    return <div className='absolute w-[300px] top-2 left-2 rounded-lg  h-12 flex items-center '>
        <Skeleton className='w-full h-full bg-neutral-200' />
    </div>
}