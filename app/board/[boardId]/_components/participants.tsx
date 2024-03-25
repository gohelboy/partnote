'use client'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { useOthers, useSelf } from '@/liveblocks.config'
import UserAvatar from './user-avatar';
import { connectionIdColor } from '@/lib/utils';

const MAX_VISIBLE_USERS = 1;

const Participant = () => {
    const users = useOthers()
    const currentUser = useSelf()
    const hasMoreUsers = users.length > MAX_VISIBLE_USERS;

    return (
        <div className='absolute top-2 right-2 min-h-12 bg-white p-2 rounded-lg  shadow-md flex flex-col sm:flex-row items-center justify-center gap-2'>
            {users.slice(0, MAX_VISIBLE_USERS).map(({ connectionId, info }) => {
                return <UserAvatar borderColor={connectionIdColor(connectionId)}
                    key={connectionId}
                    src={info?.picture}
                    name={info?.username}
                    fallback={info?.username?.[0] || "M"} />
            })}

            {currentUser &&
                <UserAvatar
                    borderColor={connectionIdColor(currentUser.connectionId)}
                    name={"You"}
                    src={currentUser.info?.picture}
                    fallback={currentUser.info?.name?.[0]}
                />
            }


            {hasMoreUsers && <UserAvatar
                name={`${users.length - MAX_VISIBLE_USERS} more`}
                fallback={`+${users.length - MAX_VISIBLE_USERS}`}
            />}
        </div>
    )
}

export default Participant


export const ParticipantsSkeleton = () => {
    return <div className='absolute top-2 right-2 h-12 bg-white rounded-lg w-[150px]'>
        <Skeleton className='w-full h-full bg-neutral-200' />
    </div>
}