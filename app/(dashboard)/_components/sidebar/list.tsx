"use client"

import { useOrganizationList } from "@clerk/nextjs";
import Items from "./items";

export const List = () => {
    const { userMemberships } = useOrganizationList({
        userMemberships: { infinite: true }
    });

    if (!userMemberships.data?.length) return null;

    return <ul className="space-y-4">
        {userMemberships.data?.map((memeber) => {
            return <Items
                key={memeber.organization.id}
                id={memeber.organization.id}
                name={memeber.organization.name}
                imageUrl={memeber.organization.imageUrl}
            />
        })}
    </ul>
}


