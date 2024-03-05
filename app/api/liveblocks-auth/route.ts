import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
    secret: "sk_dev_uuT_OduF9HLsojLJXpZlAk2I6SMkSaJBNt890Kjp_Px7osT6G3TUezo1CeDhp8K1"
})

export const POST = async (request: Request) => {
    const authorization = await auth();
    const user = await currentUser();

    if (!authorization || !user) {
        return new Response("Unvalid authorization", { status: 403 })
    }
    const { room } = await request.json();
    const board = await convex.query(api.board.get, { id: room });

    if (board?.orgId !== authorization.orgId) {
        return new Response("invalid oraganization request", { status: 403 })
    }

    const userInfo = {
        username: user.username || user.firstName + " " + user.lastName || "Member",
        picture: user.imageUrl,
    };

    const session = liveblocks.prepareSession(user.id, { userInfo })
    if (room) {
        session.allow(room, session.FULL_ACCESS);
    }

    const { status, body } = await session.authorize();
    return new Response(body, { status });
}
