"use client"

import { Plus } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Hint } from "@/components/hint";

export const NewButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="aspect-square">
                    <Hint sideOffset={18} side="right" align="start" label="Create organization">
                        <button className="bg-white/25 hover:bg-white h-full w-full rounded-md flex items-center justify-center hover:text-black">
                            <Plus />
                        </button>
                    </Hint>
                </div>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none w-auto max-w-[480px]">
                <CreateOrganization />
            </DialogContent>
        </Dialog>
    );
}