import Image from "next/image"
import { CreateOrganization } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { PenTool } from "lucide-react"
const EmptyOrg = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Image height={150} width={150} src="/element.png" alt="Empty" />
            <h2 className="text-2xl font-semibold mt-6">Welcome to Board</h2>
            <p className="text-sm text-muted-foreground">Create an organization to get started</p>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mt-6 flex items-center gap-1">
                        <PenTool className="h-4 w-4" />
                        <span>Create organization</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-transparent border-none w-auto max-w-[480px]">
                    <CreateOrganization />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EmptyOrg