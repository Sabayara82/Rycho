// import { TextEncoder, TextDecoder } from 'text-encoding';
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import { POST, GET } from "@/app/api/notifications/route"; 
import Notification from "@/models/notificationsModel";


jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn()
  }
}));

describe("POST function", () => {
  test("adds a notification", async () => {
    const reqBody = {
      method: "addNotif",
      body:{
        postId: "66007e3b2f014e9d747db6ec",
        userId: "31cmwno2jnggtf337lrgxjzz2eha",
        Type: "comment",
        Text:"dfafdsfdf",
        FromUserId: "31mpnhx5k235wcxefv7j6y63spde",
        Time: "2001-02-01T07:00:00.000Z"
      }
    };
    const request = new NextRequest();
    request.json = jest.fn().mockResolvedValue(reqBody);
    const existingNotification = null; 
    const newId = new mongoose.Types.ObjectId().toHexString();
    const saveMock = jest.spyOn(Notification.prototype, "save").mockResolvedValue({});
    await POST(request);


    expect(saveMock).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({
      message: "Notification created successfully",
      success: true,
      savedNotif: {}
    });
  });
});


describe("GET function", () => {
  
test("returns notifications for specific user", async () => {
  const urlParams = new URLSearchParams();
  urlParams.append("userId", "someUserId"); 

  const request = new NextRequest();
  request.url = `http://localhost:3000/api/notifications/?${urlParams.toString()}`;

  await GET(request);
  expect(NextResponse.json).toHaveBeenCalledWith({ notifications:[] });
});

  
  
    test("handles missing parameters", async () => {
      const request = new NextRequest();
      request.url = "http://localhost:3000/api/notifications";
  
      await GET(request);
  
      expect(NextResponse.json).toHaveBeenCalledWith({ error: "User ID parameter is missing" }, { status: 400 });
    });


    test("handles user not found", async () => {
      const urlParams = new URLSearchParams();
      urlParams.append("userId", "nonExistentId");
    
      const request = new NextRequest();
      request.url = `http://localhost:3000/api/notifications/?${urlParams.toString()}`;
      await GET(request);
  
      expect(NextResponse.json).toHaveBeenCalledWith({ error: "User ID parameter is missing" }, { status: 400 });
    });
    
  });