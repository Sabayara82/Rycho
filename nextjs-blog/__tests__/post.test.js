import { NextRequest, NextResponse } from "next/server";
import {GET, POST } from '@/app/api/feed/post/route';
import Post from '@/models/postModel';

// Mock the NextRequest and NextResponse modules
jest.mock("next/server", () => ({
    NextRequest: jest.fn(),
    NextResponse: {
      json: jest.fn(() => ({
        status: jest.fn().mockReturnThis(), // Chainable method
      })),
    },
}));
  

describe("POST Function", () => {
    test("addPost", async () => {
        // mock Post
        const mockPost = {
            method: "addPost",
            body: {
                spotifyId: "hb4db4bc2b",
                songName: "EdEddnEddy",
                albumName: "The Never Story",
                artistName: "JID",
                imageURL: "https://upload.wikimedia.org/wikipedia/en/c/ca/J.I.D_%E2%80%93_The_Never_Story.png",
                audioURL: "testURL",
                caption: "My song",
                likes: 43,
                roomStat: false,
                comments: []
            }
        };

        // Mock request object
        const request = new NextRequest();
        request.json = jest.fn().mockResolvedValue(mockPost);

        // Mock Post model methods
        const saveMock = jest.spyOn(Post.prototype, "save").mockResolvedValue({});

        // Call the POST function with the mock request object
        await POST(request);

        // Add your assertions here to verify the behavior of the POST function
        expect(saveMock).toHaveBeenCalled();
        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Post created successfully",
            success: true,
            savedPost: {}
        });
    });

    test("handle error thrown by save method", async () => {
        // Mock Post model's save method to throw an error
        jest.spyOn(Post.prototype, "save").mockRejectedValue(new Error("Failed to save post"));
    
        // Mock request object with valid post data
        const request = new NextRequest();
        request.json = jest.fn().mockResolvedValue({
            method: "addPost",
            body: {
                spotifyId: "hb4db4bc2b",
                songName: "EdEddnEddy",
                albumName: "The Never Story",
                artistName: "JID",
                imageURL: "https://upload.wikimedia.org/wikipedia/en/c/ca/J.I.D_%E2%80%93_The_Never_Story.png",
                audioURL: "testURL",
                caption: "My song",
                likes: 43,
                roomStat: false,
                comments: []
            }
        });
        
        // Call the POST function with the mock request object
        await POST(request);

        expect(NextResponse.json).toHaveBeenCalledWith({ error: "Failed to save post" }, { status: 500 });

        
    });
});

describe("GET function", () => {


    // Test Case 1: Successful Post Retrieval
    test("successfully retrieve a post by spotifyId", async () => {
        // Prepare a mock post to be returned by the Post.find method
        const mockPost = {
            body: {
                spotifyId: "testSpotifyId",
                songName: "EdEddnEddy",
                albumName: "The Never Story",
                artistName: "JID",
                imageURL: "https://upload.wikimedia.org/wikipedia/en/c/ca/J.I.D_%E2%80%93_The_Never_Story.png",
                audioURL: "testURL",
                caption: "My song",
                likes: 43,
                roomStat: false,
                comments: []
            }
        };

        const urlParams = new URLSearchParams();
        urlParams.append("spotifyId", "testSpotifyId");

        const request = new NextRequest();
        request.url = `http://example.com/?${urlParams.toString()}`;

        const findMock = jest.spyOn(Post, "find").mockResolvedValue(mockPost);

        await GET(request);

        expect(findMock).toHaveBeenCalledWith({ spotifyId: "testSpotifyId" });
    });

    //Test Case 2: Nonexistent ID
    test("Nonexistent ID", async () => {
        const urlParams = new URLSearchParams();
        urlParams.append("spotifyId", "nonExistentId");

        const request = new NextRequest();
        request.url = `http://example.com/?${urlParams.toString()}`;

        const findMock = jest.spyOn(Post, "find").mockResolvedValue(null);

        await GET(request);

        expect(findMock).toHaveBeenCalledWith({ spotifyId: "nonExistentId" });
    });

    /*
    Test Case 3: Missing SpotifyID in request
    test for an appropriate response when the spotifyId is missing
    */
    test("handle missing spotifyId in request", async () => {
        jest.spyOn(Post, "find").mockRejectedValue(new Error("missing spotifyId in request"));
    
        const request = new NextRequest();
        request.url = "http://example.com/";

        await GET(request);

        expect(NextResponse.json).toHaveBeenCalledWith({ error: "missing spotifyId in request" }, { status: 500 });
    }); 
});

