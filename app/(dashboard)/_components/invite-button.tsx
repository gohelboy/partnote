"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { OrganizationProfile } from "@clerk/nextjs"
import { Plus } from "lucide-react"

const InviteButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1 p-3">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:block">Invite member</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none w-auto max-w-[880px]">
                <OrganizationProfile />
            </DialogContent>
        </Dialog>
    )
}

export default InviteButton