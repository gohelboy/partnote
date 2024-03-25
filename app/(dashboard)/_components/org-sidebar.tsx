"use client"

import { Button } from "@/components/ui/button";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const OrgSidebar = () => {
    const searchParams = useSearchParams();
    const favorite = searchParams.get("favorites");
    return (
        <div className="hidden md:flex flex-col space-y-6  pl-5 pt-5">
            <Link href="/">
                <div className="flex items-center gap-1">
                    <Image src="./logo.svg" width={240} height={40} alt="logo" />
                </div>
            </Link>
            <OrganizationSwitcher hidePersonal
                appearance={{
                    elements: {
                        rootBox: {
                            display: 'flex',
                            width: '100%',
                        },
                        organizationSwitcherTrigger: {
                            padding: "6px",
                            width: '100%',
                            border: "1px solid #e5e7eb",
                            display: 'flex',
                            justifyContent: "space-between"
                        },
                    }
                }} />

            <div className="space-y-2">
                <Button asChild variant={favorite ? "ghost" : "default"} className=" justify-start font-normal w-full">
                    <Link href="/">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        <span>Team boards</span>
                    </Link>
                </Button>
                <Button asChild variant={favorite ? "default" : "ghost"} className="justify-start font-normal w-full">
                    <Link href={{ pathname: "/", query: { favorites: true } }}>
                        <Star className="h-4 w-4 mr-2" />
                        <span>Favorite boards</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}