import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";

export async function DELETE(request: NextRequest, {params} : {params: {id: string}}) {
    try {
        await connect('feed');
        const post = await Post.findOne( {"_id": params.id});
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        await Post.deleteOne( {"_id": params.id});

        return NextResponse.json({
            message: "Post has been deleted",
            success: true
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest, {params} : {params: {id: string}}) {
    try {
        const post = await Post.findById(params.id);
        if (!post){
            return NextResponse.json({ error: "post not found" }, { status: 404 });
        }
        return NextResponse.json({ post });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, {params} : {params: {id: string}}) {
    const reqBody = await request.json();
    const action = reqBody.action;

    if (!action || (action !== "addALike" && action !== "removeALike")) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    try {
        let update;
        if (action === "addALike") {
            update = { $inc: { likes: 1 } }; // Increment likes by 1
        } else {
            update = { $inc: { likes: -1 } }; // Decrement likes by 1
        }

        const thePost = await Post.findByIdAndUpdate(params.id, update, { new: true });

        if (!thePost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        return NextResponse.json({
            message: `Like count has been ${action === "addALike" ? "incremented" : "decremented"}`,
            success: true,
            likes: thePost.likes // Optionally return the updated likes count
        });

    } catch (e) {
        const error = e as any;
        return NextResponse.json({ error: "An error occurred", details: error.message }, { status: 500 });
    }
}


