import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import FavSong from "@/models/favModel";


export async function POST(request: NextRequest) {
    const req = await request.json()
    try {
        const { spotifyId, audioURL, artistName, songName } = await req;
        const existingUser = await FavSong.findOne({spotifyId});

        if(existingUser){
            await FavSong.deleteOne({ spotifyId });
        }

        const newFavSong = new FavSong ({
            spotifyId,
            audioURL,
            artistName, 
            songName
        })

        const saveNewFavSong = await newFavSong.save()
        console.log(saveNewFavSong);
        
        return NextResponse.created({ newFavSong });
    } catch (error: any) {
        return NextResponse.error({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const urlParams = new URLSearchParams(request.url.split("?")[1]);
        const spotifyId = urlParams.get("spotifyId");

        const favSong = await FavSong.findOne({ spotifyId });

        if (favSong) {
            return NextResponse.json({ favSong });
        } else {
            return NextResponse.json("FavSong not found", { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.error(new Error(`Failed to fetch FavSong: ${error.message}`), { status: 500 });
    }
}
