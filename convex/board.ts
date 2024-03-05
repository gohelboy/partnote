import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

const images = [
    "/placeholder/1.png",
    "/placeholder/2.png",
    "/placeholder/3.png",
    "/placeholder/4.png",
    "/placeholder/5.png",
    "/placeholder/6.png",
    "/placeholder/7.png",
    "/placeholder/8.png",
    "/placeholder/9.png",
    "/placeholder/10.png",
]

export const create = mutation({

    args: {
        orgId: v.string(),
        title: v.string(),
    },

    handler: async (ctx, args) => {
        const indentity = await ctx.auth.getUserIdentity();
        if (!indentity) throw new Error("Unauthorized access");
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const board = await ctx.db.insert("boards", {
            title: args.title,
            orgId: args.orgId,
            authorId: indentity.subject,
            authorName: indentity.name!,
            imageUrl: randomImage
        })
        return board;
    }
})

export const remove = mutation({

    args: { id: v.id("boards") },

    handler: async (ctx, args) => {
        const indentity = await ctx.auth.getUserIdentity();
        if (!indentity) throw new Error("Unauthorized access");

        const userId = indentity.subject;


        const existingFavorites = await ctx.db.query("userFavorites")
            .withIndex("by_user_board", (q) =>
                q
                    .eq("userId", userId)
                    .eq("boardId", args.id)
            ).unique();

        if (existingFavorites) {
            await ctx.db.delete(existingFavorites._id);
        }

        await ctx.db.delete(args.id);

    }
})

export const get = query({
    args: { id: v.id("boards") },
    handler: (ctx, args) => {
        const board = ctx.db.get(args.id);
        return board;
    }
})

export const updateBoardName = mutation({

    args: { id: v.id("boards"), title: v.string() },

    handler: async (ctx, args) => {
        const indentity = await ctx.auth.getUserIdentity();
        if (!indentity) throw new Error("Unauthorized access");

        const title = args.title.trim();
        if (!title) throw new Error("Title is required!");
        if (title.length > 60) throw new Error("Title must be at less than 60 characters");

        const board = await ctx.db.patch(args.id, {
            title: args.title,
        });
        return board;
    }
})

export const addToFavorite = mutation({
    args: { boardId: v.id("boards"), orgId: v.string() },
    handler: async (ctx, args) => {
        const indentity = await ctx.auth.getUserIdentity();
        if (!indentity) throw new Error("Unauthorized access");
        const board = await ctx.db.get(args.boardId);
        if (!board) throw new Error("Board not found!");

        const userId = indentity.subject;

        const alreadyFavorited = await ctx.db.query("userFavorites")
            .withIndex("by_user_board", (q) => q
                .eq("userId", userId)
                .eq("boardId", board._id))
            .unique();
        if (alreadyFavorited) throw new Error("Already favorited!");

        await ctx.db.insert("userFavorites", {
            userId: userId,
            boardId: board._id,
            orgId: args.orgId,
        })

        return board;
    }
})

export const removeFromFavorite = mutation({
    args: { boardId: v.id("boards") },
    handler: async (ctx, args) => {
        const indentity = await ctx.auth.getUserIdentity();
        if (!indentity) throw new Error("Unauthorized access");
        const board = await ctx.db.get(args.boardId);
        if (!board) throw new Error("Board not found!");

        const userId = indentity.subject;

        const alreadyFavorited = await ctx.db.query("userFavorites").withIndex("by_user_board", (q) => q
            .eq("userId", userId).eq("boardId", board._id)).first();

        if (!alreadyFavorited) throw new Error("Favorited board not found!");

        await ctx.db.delete(alreadyFavorited._id)
        return board;
    }
})