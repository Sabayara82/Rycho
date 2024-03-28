import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import Comment from "@/models/commentModel";
import Post from "@/models/postModel";

//you need to try and return the commentID 
export async function POST(request: NextRequest) {
    const req = await request.json()
    try {
        await connect('feed')
        const { postId, spotifyId, content, numerOfLikes } = req;
        const newComment = new Comment ({
            postId, 
            spotifyId,
            content,
            numerOfLikes
        })

        const savedComment = await newComment.save()
        return NextResponse.json({
            message: "Comment created successfully",
            success: true,
            status: 200, 
            savedComment: savedComment 

        })
    } catch (error: any) {
        return NextResponse.json({error: error.message},
            {status: 500})
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const postId = url.searchParams.get("postId");

        const allComments = await Comment.find( {postId} );
        return NextResponse.json({ allComments });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


//note this function isnt working yet so you need ot try and fix it 
export async function PATCH(request: NextRequest) {
    try {
        const req = await request.json();
        const { postId, commentId } = req;

        // Find the post by its ID
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        post.comments.push(commentId);

        await post.save();

        return NextResponse.json({ message: "Comment ID added to post's comments array", success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}