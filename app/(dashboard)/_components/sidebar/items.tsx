import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import Image from "next/image";


interface ItemProps {
    id: string;
    name: string;
    imageUrl: string;
}

const Items = ({ id, name, imageUrl }: ItemProps) => {
    const { organization } = useOrganization();
    const { setActive } = useOrganizationList();

    const isActive = organization?.id === id;

    const onClick = () => {
        if (!setActive) return;
        setActive({ organization: id });
    }

    return (
        <div className="aspect-square relative">
            <Hint label={name} side="right" sideOffset={18}  >

                <Image fill src={imageUrl} alt={name} onClick={onClick}
                    className={cn("rounded-md cursor-pointer opacity-75 hover:opacity-100",
                        isActive && "opacity-100")} />
            </Hint>
        </div>
    )
}

export default Items