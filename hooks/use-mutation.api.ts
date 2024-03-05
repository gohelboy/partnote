import { useMutation } from "convex/react";
import { useState } from "react";

export const useAPiMutation = (mutationFunction: any) => {
    const [pending, setPending] = useState(false);
    const apiMutation = useMutation(mutationFunction);

    const mutate = (payload: any) => {
        setPending(true);
        return apiMutation(payload).finally(() => setPending(false))
            .then(response => response)
            .catch((error) => { throw error })
    }

    return { mutate, pending };
}