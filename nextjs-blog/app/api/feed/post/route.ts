import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";

export async function POST(request: NextRequest) {
    const req = await request.json()
    if (req.method === 'addPost') {
        try {
            await connect('feed')
            const { spotifyId, albumName, albumURL, songName, createdAt, caption, likes, roomStat, comments } = req;
            const newPost = new Post ({
                spotifyId, 
                albumName, 
                albumURL, 
                songName, 
                createdAt, 
                caption, 
                likes, 
                roomStat, 
                comments
            })
    
            const savedPost = await newPost.save()
            console.log(savedPost);
    
            return NextResponse.json({
                message: "Post created successfully",
                success: true,
                savedPost
            })
        } catch (error: any) {
            return NextResponse.json({error: error.message},
                {status: 500})
        }
    } else {
        return NextResponse.json({error: 'Method Not Allowed'},
            {status: 405})
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const spotifyId = url.searchParams.get("spotifyId");

        const allPosts = await Post.find( {spotifyId} );
        return NextResponse.json({ allPosts });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}