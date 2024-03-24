import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import Comment from "@/models/commentModel";

export async function DELETE(request: NextRequest, {params} : {params: {id: string}}) {
    try {
        await connect('feed');
        const comment = await Comment.findOne( {"_id": params.id});
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        await comment.deleteOne( {"_id": params.id});

        return NextResponse.json({
            message: "Comment has been deleted",
            success: true
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest, {params} : {params: {id: string}}) {
    try {
        const comment = await Comment.findById(params.id);
        if (!comment){
            return NextResponse.json({ error: "comment not found" }, { status: 404 });
        }
        return NextResponse.json({ comment });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}