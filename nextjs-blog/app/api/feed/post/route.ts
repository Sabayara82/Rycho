import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";

let connection: any

async function _connect(database: 'feed' | 'notifications' | 'users' | 'rycho'){
  if (!connection){
    connection = await connect(database);
  }
  return connection;
}

export async function POST(request: NextRequest) {
  const req = await request.json();
  if (req.method === "addPost") {
    try {
      await _connect("feed");
      const {
        spotifyId,
        songName,
        albumName,
        artistName,
        imageURL,
        audioURL,
        caption,
        likes,
        roomStat,
        comments,
      } = req;
      const newPost = new Post({
        spotifyId,
        songName,
        albumName,
        artistName,
        imageURL,
        audioURL,
        caption,
        likes,
        roomStat,
        comments,
      });

      const savedPost = await newPost.save();

      return NextResponse.json({
        message: "Post created successfully",
        success: true,
        savedPost,
      });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const spotifyId = url.searchParams.get("spotifyId");

    const allPosts = await Post.find({ spotifyId });
    return NextResponse.json({ allPosts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
