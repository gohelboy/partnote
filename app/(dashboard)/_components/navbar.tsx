"use client"
import { OrganizationSwitcher, UserButton, useOrganization } from '@clerk/nextjs'
import React from 'react'
import SearchBarInput from './searchbar-input'
import InviteButton from './invite-button'
import Link from "next/link";
import Image from 'next/image'

const Navbar = () => {
    const { organization } = useOrganization();
    return (
        <div className="flex items-center gap-4 p-5">
            <div className='hidden md:flex md:flex-1'>
                <SearchBarInput />
            </div>

            <div className='block md:hidden flex-1'>
                <Link href="/">
                    <div className="flex items-center gap-1">
                        <Image src="./logo.svg" width={140} height={30} alt="logo" />
                        {/* <span className="font-bold">Skribble</span> */}
                    </div>
                </Link>

                {/* <OrganizationSwitcher hidePersonal
                    appearance={{
                        elements: {
                            rootBox: {
                                display: 'flex',
                                width: '100%',
                                maxWidth: "250px",
                            },
                            organizationSwitcherTrigger: {
                                padding: "3px",
                                width: '100%',
                                border: "1px solid #e5e7eb",
                                display: 'flex',
                                justifyContent: "space-between"

                            },
                        }
                    }} /> */}
            </div>
            {organization && (<InviteButton />)}
            <UserButton />
        </div>
    )
}

export default Navbar