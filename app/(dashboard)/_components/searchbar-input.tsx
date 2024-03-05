"use client"

import qs from "query-string"
import { Search } from "lucide-react"
import { useDebounce } from "usehooks-ts"
import { useRouter } from "next/navigation"
import { ChangeEvent, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"


const SearchBarInput = () => {

    const router = useRouter();
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 600);

    const handelChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: "/",
            query: { search: debouncedValue }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [debouncedValue, router])

    return (
        <div className="flex items-center w-full relative">
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="w-full max-w-[500px] pl-9" value={value} onChange={handelChange} />
        </div>
    )
}

export default SearchBarInput;