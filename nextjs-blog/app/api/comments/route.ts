import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import Comment from "@/models/commentModel";

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
        console.log(savedComment);

        return NextResponse.json({
            message: "Comment created successfully",
            success: true,
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