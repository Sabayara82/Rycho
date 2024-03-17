import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/UserModel";

connect()

export async function POST(request: NextRequest) {
    const req = await request.json()
    if (req.method === 'addUser') {
        try {
            const { spotifyId, username, followers, following } = req.body;
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
                console.log(savedUser);
        
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
    } else {
        return NextResponse.json({error: 'Method Not Allowed'},
            {status: 405})
    }
}

export async function PUT(request: NextRequest) {
    const req = await request.json();
    if (req.method === 'addFollowing') {
        try {            
            const { userId, followUserId } = req.body;

            const user = await User.findById(userId);

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const followUser = await User.findById(followUserId);

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

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    } else if (req.method === 'addFollower') {
        try {
            const { userId, followerUserId } = req.body;

            const user = await User.findById(userId);

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const followerUser = await User.findById(followerUserId);

            if (!followerUser) {
                return NextResponse.json({ error: "Follower user not found" }, { status: 404 });
            }

            if (user.followers.includes(followerUserId)) {
                return NextResponse.json({ error: "User is already followed by this follower" }, { status: 400 });
            }

            user.followers.push(followerUserId);
            await user.save();

            return NextResponse.json({
                message: "Follower added successfully",
                success: true
            });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({error: 'Method Not Allowed'},
        {status: 405})
    }

}

// export async function GET(request: NextRequest) {
//     const req = await request.json()
//     if (req.method === 'getUsers') {
//         try {
//             const { spotifyId, username, followers, following } = req.body;
//             const existingUser = await User.findOne({ spotifyId });

//             if (existingUser) {
//                 return NextResponse.json({error: "User already exists"}, {status: 400});
//             } else {
//                 const newUser = new User ({
//                     spotifyId,
//                     username,
//                     followers,
//                     following
//                 })
        
//                 const savedUser = await newUser.save()
//                 console.log(savedUser);
        
//                 return NextResponse.json({
//                     message: "User created successfully",
//                     success: true,
//                     savedUser
//                 })
//             }
//         } catch (error: any) {
//             return NextResponse.json({error: error.message},
//                 {status: 500})
//         }
//     } else {
//         return NextResponse.json({error: 'Method Not Allowed'},
//             {status: 405})
//     }
// }

// export async function GET(request: NextRequest) {
//     try {
//         const urlParams = new URLSearchParams(request.url.split("?")[1]);
//         const action = urlParams.get("action");
//         const userId = urlParams.get("userId");
//         const spotifyId = urlParams.get("spotifyId");

//         if (!userId && !spotifyId) {
//             return NextResponse.json({ error: "User ID or Spotify ID parameter is missing" }, { status: 400 });
//         }

//         let user;

//         if (userId) {
//             user = await User.findById(userId);
//         } else if (spotifyId) {
//             user = await User.findOne({ spotifyId });
//         }

//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         if (action === 'getFollowing') {
//             const following = await User.find({ _id: { $in: user.following } });
//             return NextResponse.json({ following });
//         } else if (action === 'getFollowers') {
//             const followers = await User.find({ _id: { $in: user.followers } });
//             return NextResponse.json({ followers });
//         } else if (action === 'getUserBySpotifyId') {
//             return NextResponse.json({ user });
//         } else {
//             return NextResponse.json({ error: "Invalid action" }, { status: 400 });
//         }
//     } catch (error: any) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }