import { Loading } from "@/components/auth/Loading"
import { InfoSkeleton } from "./info"
import { ParticipantsSkeleton } from "./participants"
import { ToolbarSkeleton } from "./toolbar"
const CanvasLoading = () => {
    return (
        <div className="h-full w-full relative touch-none flex items-center justify-center bg-neutral-100">
            <Loading classes="animate-pulse duration-1000" />
            <InfoSkeleton />
            <ParticipantsSkeleton />
            <ToolbarSkeleton />
        </div>
    )
}

export default CanvasLoading