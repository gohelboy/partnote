import { getAllOrThrow } from 'convex-helpers/server/relationships';
import { v } from "convex/values"
import { query } from './_generated/server';


export const get = query({
    args: {
        orgId: v.string(),
        search: v.optional(v.string()),
        favorites: v.optional(v.string()),
    },

    handler: async (ctx, args) => {
        const indentity = await ctx.auth.getUserIdentity();
        if (!indentity) throw new Error("Unauthorized access");


        if (args.favorites) {
            const favoritedBoards = await ctx.db.query("userFavorites")
                .withIndex("by_user_org",
                    (q) => q.eq("userId", indentity.subject).eq("orgId", args.orgId)).order("desc").collect();

            const ids = favoritedBoards.map((b) => b.boardId)
            const boards = await getAllOrThrow(ctx.db, ids);

            return boards.map((board: any) => {
                return {
                    ...board,
                    isFavorite: true,
                }
            })
        }


        let boards = []
        const title = args.search as string;
        if (title) {
            boards = await ctx.db
                .query("boards")
                .withSearchIndex("search_title", (q) =>
                    q.search("title", title)
                        .eq("orgId", args.orgId))
                .collect();
        } else {
            boards = await ctx.db
                .query("boards")
                .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
                .order("desc")
                .collect();
        }



        const boardsWithFavoritedRelation = boards.map((board) => {
            return ctx.db.query("userFavorites")
                .withIndex("by_user_board", (q) =>
                    q
                        .eq("userId", indentity.subject)
                        .eq("boardId", board._id)
                ).first().then((fav) => {
                    return {
                        ...board,
                        isFavorite: !!fav,
                    }
                })
        })

        const boardWithFavoriteBoolean = await Promise.all(boardsWithFavoritedRelation)
        return boardWithFavoriteBoolean;
    }

})
