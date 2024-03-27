// import { TextEncoder, TextDecoder } from 'text-encoding';
import { NextRequest, NextResponse } from "next/server";
import { POST, PUT, DELETE, GET } from "@/app/api/users/profile/route"; 
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

describe("PUT function", () => {
  describe("addFollowing action", () => {
    test("adds a new following user", async () => {
      const reqBody = {
        action: "addFollowing",
        spotifyId: "someId",
        followUserId: "someOtherId"
      };

      const request = new NextRequest();
      request.json = jest.fn().mockResolvedValue(reqBody);

      const user = { following: [] };
      const followUser = { spotifyId: reqBody.followUserId };
      const findOneUserMock = jest.spyOn(User, "findOne").mockResolvedValue(user);
      const findOneFollowUserMock = jest.spyOn(User, "findOne").mockResolvedValue(followUser);
      const saveMock = jest.spyOn(User.prototype, "save").mockResolvedValue({});

      await PUT(request);

      expect(findOneUserMock).toHaveBeenCalledWith({ spotifyId: reqBody.spotifyId });
      expect(findOneFollowUserMock).toHaveBeenCalledWith({ spotifyId: reqBody.followUserId });
      expect(user.following.includes(reqBody.followUserId)).toBe(false);
      expect(saveMock).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalledWith({
        message: "User created successfully",
        success: true,
        savedUser: {} 
      });
    });
  });
  describe("addFollower action", () => {
    test("adds a new follower user", async () => {
        const reqBody = {
            action: "addFollower",
            spotifyId: "someId",
            followUserId: "someOtherId"
        };

        const request = new NextRequest();
        request.json = jest.fn().mockResolvedValue(reqBody);

        const user = { followers: [] };
        const followUser = { spotifyId: reqBody.followUserId };

        const findOneUserMock = jest.spyOn(User, "findOne").mockResolvedValue(user);
        const findOneFollowUserMock = jest.spyOn(User, "findOne").mockResolvedValue(followUser);
        const saveMock = jest.spyOn(User.prototype, "save").mockResolvedValue({});

        await PUT(request);

        expect(findOneUserMock).toHaveBeenCalledWith({ spotifyId: reqBody.spotifyId });
        expect(findOneFollowUserMock).toHaveBeenCalledWith({ spotifyId: reqBody.followUserId });
        expect(user.followers.includes(reqBody.followUserId)).toBe(false); 
        expect(saveMock).toHaveBeenCalled();
        expect(NextResponse.json).toHaveBeenCalledWith({
          message: "User created successfully",
          success: true,
          savedUser: {} 
      });
    });
  });
  test("handles invalid action", async () => {
    const reqBody = {
      action: "invalidAction",
      spotifyId: "someId",
      followUserId: "someOtherId"
    };

    const request = new NextRequest();
    request.json = jest.fn().mockResolvedValue(reqBody);

    await PUT(request);

    expect(NextResponse.json).toHaveBeenCalledWith({
      error: "Invalid action"
    }, {
      status: 400
    });
  });
});

describe("GET function", () => {
  test("returns all users", async () => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "getAllUsers");

    const request = new NextRequest();
    request.url = `http://example.com/?${urlParams.toString()}`;

    const allUsers = [{ username: "user1", spotifyId: "id1" }, { username: "user2", spotifyId: "id2" }];
    const findMock = jest.spyOn(User, "find").mockResolvedValue(allUsers);

    await GET(request);

    expect(findMock).toHaveBeenCalledWith({}, 'username spotifyId');
    expect(NextResponse.json).toHaveBeenCalledWith({ allUsers });
  });

  test("returns user by Spotify ID", async () => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "getUserBySpotifyId");
    urlParams.append("spotifyId", "someId");

    const request = new NextRequest();
    request.url = `http://example.com/?${urlParams.toString()}`;

    const user = { username: "someUsername", spotifyId: "someId" };
    const findOneMock = jest.spyOn(User, "findOne").mockResolvedValue(user);

    await GET(request);

    expect(findOneMock).toHaveBeenCalledWith({ spotifyId: "someId" });
    expect(NextResponse.json).toHaveBeenCalledWith({ user });
  });

  test("returns user's following", async () => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "getFollowing");
    urlParams.append("spotifyId", "someId");

    const request = new NextRequest();
    request.url = `http://example.com/?${urlParams.toString()}`;

    const user = { following: ["followingId1", "followingId2"] };
    const findOneMock = jest.spyOn(User, "findOne").mockResolvedValue(user);
    const findMock = jest.spyOn(User, "find").mockResolvedValue([]);

    await GET(request);

    expect(findMock).toHaveBeenCalledWith({ spotifyId: { $in: user.following } });
    expect(NextResponse.json).toHaveBeenCalledWith({ following: [] });
  });

  test("returns user's followers", async () => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "getFollowers");
    urlParams.append("spotifyId", "someId");

    const request = new NextRequest();
    request.url = `http://example.com/?${urlParams.toString()}`;

    const user = { followers: ["followerId1", "followerId2"] };
    const findOneMock = jest.spyOn(User, "findOne").mockResolvedValue(user);
    const findMock = jest.spyOn(User, "find").mockResolvedValue([]);

    await GET(request);

    expect(findMock).toHaveBeenCalledWith({ spotifyId: { $in: user.followers } });
    expect(NextResponse.json).toHaveBeenCalledWith({ followers: [] });
  });

  test("handles missing parameters", async () => {
    const request = new NextRequest();
    request.url = "http://example.com/";

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "User ID or Spotify ID parameter is missing" }, { status: 400 });
  });

  test("handles user not found", async () => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "getUserBySpotifyId");
    urlParams.append("spotifyId", "nonExistentId");

    const request = new NextRequest();
    request.url = `http://example.com/?${urlParams.toString()}`;

    const findOneMock = jest.spyOn(User, "findOne").mockResolvedValue(null);

    await GET(request);

    expect(findOneMock).toHaveBeenCalledWith({ spotifyId: "nonExistentId" });
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "User not found" }, { status: 404 });
  });

  test("handles invalid action", async () => {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "invalidAction");
    urlParams.append("spotifyId", "someId");

    const request = new NextRequest();
    request.url = `http://example.com/?${urlParams.toString()}`;

    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Invalid action" }, { status: 400 });
  });
});


describe("DELETE function", () => {
  describe("removeFollowing action", () => {
    test("removes a following user", async () => {
      const reqBody = {
        action: "removeFollowing",
        spotifyId: "someId",
        followUserId: "followingIdToRemove"
      };
    
      const request = new NextRequest();
      request.json = jest.fn().mockResolvedValue(reqBody);
    
      const user = { following: ["followingId1", "followingIdToRemove", "followingId2"] };
      const findOneMock = jest.spyOn(User, "findOne").mockResolvedValue(user);
      const saveMock = jest.spyOn(User.prototype, "save").mockResolvedValue({});
    
      await DELETE(request);
    
      expect(findOneMock).toHaveBeenCalledWith({ spotifyId: reqBody.spotifyId });
      expect(user.following.includes(reqBody.followUserId)).toBe(false);
      expect(saveMock).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalledWith({
        message: "Following user removed successfully",
        message: "User created successfully",
        savedUser: {},
        success: true
      });
    });
    
    test("handles user not found", async () => {
      const reqBody = {
        action: "removeFollowing",
        spotifyId: "nonExistentId",
        followUserId: "followingId1"
      };

      const request = new NextRequest();
      request.json = jest.fn().mockResolvedValue(reqBody);

      const findOneMock = jest.spyOn(User, "findOne").mockResolvedValue(null);

      await DELETE(request);

      expect(findOneMock).toHaveBeenCalledWith({ spotifyId: reqBody.spotifyId });
      expect(NextResponse.json).toHaveBeenCalledWith({ error: "User not found" }, { status: 404 });
    });

    test("handles user not following", async () => {
      const reqBody = {
        action: "removeFollowing",
        spotifyId: "someId",
        followUserId: "nonExistingFollowingId"
      };

      const request = new NextRequest();
      request.json = jest.fn().mockResolvedValue(reqBody);

      const user = { following: ["followingId1", "followingId2"] };
      const findOneMock = jest.spyOn(User, "findOne").mockResolvedValue(user);

      await DELETE(request);

      expect(findOneMock).toHaveBeenCalledWith({ spotifyId: reqBody.spotifyId });
      expect(NextResponse.json).toHaveBeenCalledWith({ error: "User is not following this user" }, { status: 400 });
    });
  });

  describe("removeFollower action", () => {
    test("removes a follower user", async () => {
      const reqBody = {
        action: "removeFollower",
        spotifyId: "someId",
        followUserId: "followerIdToRemove"
      };
    
      const request = new NextRequest();
      request.json = jest.fn().mockResolvedValue(reqBody);
    
      const user = { followers: ["followerId1", "followerIdToRemove", "followerId2"] };
      const findOneMock = jest.spyOn(User, "findOne").mockResolvedValue(user);
      const saveMock = jest.spyOn(User.prototype, "save").mockResolvedValue({});
    
      await DELETE(request);
    
      expect(findOneMock).toHaveBeenCalledWith({ spotifyId: reqBody.spotifyId });
      expect(user.followers.includes(reqBody.followUserId)).toBe(false);
      expect(saveMock).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalledWith({
        message: "Follower user removed successfully",
        message: "User created successfully",
        success: true,
        savedUser: {}
      });
    });
    
    test("handles user not found", async () => {
      const reqBody = {
        action: "removeFollower",
        spotifyId: "nonExistentId",
        followUserId: "followerId1"
      };

      const request = new NextRequest();
      request.json = jest.fn().mockResolvedValue(reqBody);

      const findOneMock = jest.spyOn(User, "findOne").mockResolvedValue(null);

      await DELETE(request);

      expect(findOneMock).toHaveBeenCalledWith({ spotifyId: reqBody.spotifyId });
      expect(NextResponse.json).toHaveBeenCalledWith({ error: "User not found" }, { status: 404 });
    });

    test("handles user not following", async () => {
      const reqBody = {
        action: "removeFollower",
        spotifyId: "someId",
        followUserId: "nonExistingFollowerId"
      };

      const request = new NextRequest();
      request.json = jest.fn().mockResolvedValue(reqBody);

      const user = { followers: ["followerId1", "followerId2"] };
      const findOneMock = jest.spyOn(User, "findOne").mockResolvedValue(user);

      await DELETE(request);

      expect(findOneMock).toHaveBeenCalledWith({ spotifyId: reqBody.spotifyId });
      expect(NextResponse.json).toHaveBeenCalledWith({ error: "User is not following this user" }, { status: 400 });
    });
  });

  test("handles invalid action", async () => {
    const reqBody = {
      action: "invalidAction",
      spotifyId: "someId",
      followUserId: "someOtherId"
    };

    const request = new NextRequest();
    request.json = jest.fn().mockResolvedValue(reqBody);

    await DELETE(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Invalid action" }, { status: 400 });
  });
});









