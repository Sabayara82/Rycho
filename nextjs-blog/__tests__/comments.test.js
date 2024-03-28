import { NextRequest, NextResponse } from "next/server";
import {GET, POST } from '@/app/api/feed/comments/route';
import Comment from '@/models/commentModel';

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
    test("add comment", async () => {
        // mock Post
        const mockComment = {
            body: {
                postId: "postID",
                spotifyId: "spotifyID",
                content: "cool song",
                numerOfLikes: 100192
            }
        };

        // Mock request object
        const request = new NextRequest();
        request.json = jest.fn().mockResolvedValue(mockComment);

        // Mock Post model methods
        const saveMock = jest.spyOn(Comment.prototype, "save").mockResolvedValue({});

        // Call the POST function with the mock request object
        await POST(request);

        // Add your assertions here to verify the behavior of the POST function
        expect(saveMock).toHaveBeenCalled();
        expect(NextResponse.json).toHaveBeenCalledWith({
            message: "Comment created successfully",
            savedComment: {},
            status: 200,
            success: true
        });
    });

    test("handle error thrown by save method", async () => {
        // Mock Post model's save method to throw an error
        jest.spyOn(Comment.prototype, "save").mockRejectedValue(new Error("Failed to save comment"));
    
        // Mock request object with valid post data
        const request = new NextRequest();
        request.json = jest.fn().mockResolvedValue({
            body: {
                postId: "postID",
                spotifyId: "spotifyID",
                content: "cool song",
                numerOfLikes: 100192
            }
        });
        
        // Call the POST function with the mock request object
        await POST(request);

        expect(NextResponse.json).toHaveBeenCalledWith({ error: "Failed to save comment" }, { status: 500 });

        
    });



});

describe("GET function", () => {
    // Test Case 1: Successful Post Retrieval
    test("successfully retrieve a post by spotifyId", async () => {
        // Prepare a mock post to be returned by the Post.find method
        const mockComment = {
            body: {
                postId: "testpostID",
                spotifyId: "spotifyID",
                content: "cool song",
                numerOfLikes: 100192
            }
        };

        const urlParams = new URLSearchParams();
        urlParams.append("postId", "testpostID");

        const request = new NextRequest();
        request.url = `http://example.com/?${urlParams.toString()}`;

        const findMock = jest.spyOn(Comment, "find").mockResolvedValue(mockComment);

        await GET(request);

        expect(findMock).toHaveBeenCalledWith({ postId: "testpostID" });
    });

    //Test Case 2: Nonexistent ID
    test("Nonexistent ID", async () => {
        const urlParams = new URLSearchParams();
        urlParams.append("postId", "nonexistentpostID");

        const request = new NextRequest();
        request.url = `http://example.com/?${urlParams.toString()}`;

        const findMock = jest.spyOn(Comment, "find").mockResolvedValue(null);

        await GET(request);

        expect(findMock).toHaveBeenCalledWith({ postId: "nonexistentpostID" });
    });

    /*
    Test Case 3: Missing SpotifyID in request
    test for an appropriate response when the spotifyId is missing
    */
    test("handle missing spotifyId in request", async () => {
        jest.spyOn(Comment, "find").mockRejectedValue(new Error("missing postId in request"));
    
        const request = new NextRequest();
        request.url = "http://example.com/";

        await GET(request);

        expect(NextResponse.json).toHaveBeenCalledWith({ error: "missing postId in request" }, { status: 500 });
    }); 

});
