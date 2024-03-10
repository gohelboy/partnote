"use client"

import { useOrganization } from "@clerk/nextjs";


interface DahsboardProps {
    searchParams: {
        search: string;
        favorites: string;
    }
}

import EmptyOrg from "./_components/emplty-org"
import BoardList from "./_components/board-list";
const Page = ({ searchParams }: DahsboardProps) => {

    const { organization } = useOrganization();

    return (
        <div className="h-[calc(100vh-80px)]">
            {!organization ? (<EmptyOrg />) : (<BoardList orgId={organization.id} query={searchParams} />)}
        </div>
    )
}

export default Page