// import { TextEncoder, TextDecoder } from 'text-encoding';
import { NextRequest, NextResponse } from "next/server";
import { POST } from "@/app/api/users/profile/route"; 
import User from "@/models/UserModel";

// Mock the NextRequest and NextResponse modules
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn()
  }
}));

describe("POST function", () => {
  test("adds a new user", async () => {
    // Mock request body
    const reqBody = {
      method: "addUser",
      body: {
        spotifyId: "someId",
        username: "someUsername",
        followers: [],
        following: []
      }
    };

    // Mock request object
    const request = new NextRequest();
    request.json = jest.fn().mockResolvedValue(reqBody);

    // Mock existing user check
    const existingUser = null; // Mock that no user exists

    // Mock User model methods
    const findOneMock = jest.spyOn(User, "findOne").mockResolvedValue(existingUser);
    const saveMock = jest.spyOn(User.prototype, "save").mockResolvedValue({});

    // Call the POST function with the mock request object
    await POST(request);

    // Add your assertions here to verify the behavior of the POST function
    expect(findOneMock).toHaveBeenCalledWith({ spotifyId: reqBody.body.spotifyId });
    expect(saveMock).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({
      message: "User created successfully",
      success: true,
      savedUser: {}
    });
  });
});