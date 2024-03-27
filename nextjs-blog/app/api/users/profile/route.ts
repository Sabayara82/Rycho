import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { profile } from "console";


export async function POST(request: NextRequest) {
    const req = await request.json()    
    try {
        await connect('users')
        console.log(req)
        const { spotifyId, username, followers, following } = req;
        const existingUser = await User.findOne({ spotifyId });

        if (existingUser) {
            return NextResponse.json({error: "User already exists"}, {status: 400});
        } else {
            const newUser = new User ({
                spotifyId,
                username,
                followers,
                following
            })
            const savedUser = await newUser.save()
            return NextResponse.json({
                message: "User created successfully",
                success: true,
                savedUser
            })
        }
    } catch (error: any) {
        return NextResponse.json({error: error.message},
            {status: 500})
        
    } 
}


export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json();

        if (!reqBody.action) {
            return NextResponse.json({ error: "Action parameter is missing" }, { status: 400 });
        }

        if (reqBody.action === 'addFollowing') {
            const { spotifyId, followUserId } = reqBody;
            const user = await User.findOne({ spotifyId });

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const followUser = await User.findOne({ spotifyId: followUserId });

            if (!followUser) {
                return NextResponse.json({ error: "User to follow not found" }, { status: 404 });
            }

            if (user.following.includes(followUserId)) {
                return NextResponse.json({ error: "User already follows this user" }, { status: 400 });
            }

            user.following.push(followUserId);
            await user.save();

            return NextResponse.json({
                message: "User is now following the user",
                success: true
            });
        } else if (reqBody.action === 'addFollower') {
                const { spotifyId, followUserId } = reqBody;

                const user = await User.findOne({ spotifyId });

                if (!user) {
                    return NextResponse.json({ error: "User not found" }, { status: 404 });
                }

                const followUser = await User.findOne({ spotifyId: followUserId });

                if (!followUser) {
                    return NextResponse.json({ error: "User to follow not found" }, { status: 404 });
                }

                if (user.followers.includes(followUserId)) {
                    return NextResponse.json({ error: "User already follows this user" }, { status: 400 });
                }

                user.followers.push(followUserId);
                await user.save();

                return NextResponse.json({
                    message: "User is now following the user",
                    success: true
                });
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



export async function DELETE(request: NextRequest) {
    try {
        const reqBody = await request.json();

        if (!reqBody.action) {
            return NextResponse.json({ error: "Action parameter is missing" }, { status: 400 });
        }

        if (reqBody.action === 'removeFollowing') {
            const { spotifyId, followUserId } = reqBody;

            const user = await User.findOne({ spotifyId });

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const index = user.following.indexOf(followUserId);
            if (index === -1) {
                return NextResponse.json({ error: "User is not following this user" }, { status: 400 });
            }

            user.following.splice(index, 1);
            await user.save();

            return NextResponse.json({
                message: "User is no longer following the user",
                success: true
            });
        } else if (reqBody.action === 'removeFollower') {
            const { spotifyId, followUserId } = reqBody;

            const user = await User.findOne({ spotifyId });

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const index = user.followers.indexOf(followUserId);
            if (index === -1) {
                return NextResponse.json({ error: "User is not following this user" }, { status: 400 });
            }

            user.followers.splice(index, 1);
            await user.save();

            return NextResponse.json({
                message: "User is no longer following the user",
                success: true
            });
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const urlParams = new URLSearchParams(request.url.split("?")[1]);
        const action = urlParams.get("action");
        const spotifyId = urlParams.get("spotifyId");

        if (action === 'getAllUsers') {
            const allUsers = await User.find({}, 'username spotifyId');
            return NextResponse.json({ allUsers });
        }

        if (!spotifyId) {
            return NextResponse.json({ error: "User ID or Spotify ID parameter is missing" }, { status: 400 });
        }

        let user;

        if (spotifyId) {
            user = await User.findOne({ spotifyId });
        }

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (action === 'getFollowing') {
            const following = await User.find({ spotifyId: { $in: user.following } });
            return NextResponse.json({ following });
        } else if  (action === 'getFollowers') {
            const followers = await User.find({ spotifyId: { $in: user.followers } });
            return NextResponse.json({ followers});
        } else if (action === 'getUserBySpotifyId') {
            return NextResponse.json({ user });
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}