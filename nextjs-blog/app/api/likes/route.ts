import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";

export async function PUT(request: NextRequest) {
    const reqBody = await request.json()
    if (reqBody.action == 'addALike'){
        const {postID} = reqBody; 
        const thePost = await Post.find( { _id: postID} );
        thePost.likes = thePost.likes + 1; 
        await thePost.save(); 
        console.log("we have entered here"); 
        return NextResponse.json({
            message: "A like has been added", 
            success: true 
        }); 
    
    } else if (reqBody.action == 'removeALike'){
        const {postID} = reqBody; 
        const thePost = await Post.find({ _id: postID}); 
        thePost.likes = thePost.likes - 1;
        await thePost.save();
    
        return NextResponse.json({
            message: "A like has been removed", 
            success: false
        }); 
    }
} 
