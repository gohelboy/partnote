import { Hint } from '@/components/hint'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

interface UserInterfaceProps {
    src?: string
    name?: string
    fallback?: string
    borderColor?: string
}

const UserAvatar = ({ src, name, fallback, borderColor }: UserInterfaceProps) => {
    return (
        <Hint label={name || "Memeber"} side='bottom' sideOffset={10}>
            <Avatar className='h-8 w-8 border-2' style={{ borderColor: borderColor }}>
                <AvatarImage src={src} />
                <AvatarFallback className='text-sm font-semibold'>
                    {fallback}
                </AvatarFallback>
            </Avatar>
        </Hint>
    )
}

export default UserAvatar