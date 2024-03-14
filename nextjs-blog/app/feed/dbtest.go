package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type FeedItem struct {
	ID              primitive.ObjectID `bson:"_id,omitempty"`
	UserID          primitive.ObjectID `bson:"userId,omitempty"`
	AlbumName       string             `bson:"albumName,omitempty"`
	Song            string             `bson:"song,omitempty"`
	AlbumURL        string             `bson:"albumUrl,omitempty"`
	CreatedAt       int32              `bson:"createdAt,omitempty"`
	Caption         string             `bson:"caption,omitempty"`
	Likes           int32              `bson:"likes,omitempty"`
	RoomStat        bool               `bson:"roomStat,omitempty"`
	ArrOfCommentIDs []int32            `bson:"arrOfCommentIds,omitempty"`
}

// the collection of comments
type Comment struct {
	ID            primitive.ObjectID `bson:"_id,omitempty"`
	UserID        primitive.ObjectID `bson:"userID,omitempty"`
	Comment       string             `bson:"comment,omitempty"`
	CreatedAt     int32              `bson:"createdAt,omitempty"`
	NumberOfLikes int32              `bson:"numberOfLikes,omitempty"`
}

func main() {
	// Use the SetServerAPIOptions() method to set the version of the Stable API on the client
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI("mongodb+srv://root:rycho123@cluster0.dk3gj4m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").SetServerAPIOptions(serverAPI)

	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		print("entered")
		panic(err)
	}

	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
		panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")

	client, err = mongo.NewClient(options.Client().ApplyURI("mongodb+srv://root:rycho123@cluster0.dk3gj4m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	feedDatabase := client.Database("feed")
	postsCollection := feedDatabase.Collection("posts")
	commentsCollection := feedDatabase.Collection("comments")

	item := FeedItem{
		ID:              primitive.NewObjectID(),
		UserID:          primitive.NewObjectID(),
		AlbumName:       "Random Album",
		Song:            "Random Song",
		AlbumURL:        "http://example.com/random_album",
		CreatedAt:       3, // Assuming this is a placeholder, use actual timestamp if available
		Caption:         "A random caption",
		Likes:           100,
		RoomStat:        true,
		ArrOfCommentIDs: []int32{1, 2, 3},
	}

	postsResult, err := postsCollection.InsertOne(ctx, item)
	if err != nil {
		fmt.Println("Error inserting document:", err)
		return
	}

	theComment := Comment{
		ID:            primitive.NewObjectID(),
		UserID:        primitive.NewObjectID(),
		Comment:       "such a sick song i love it",
		CreatedAt:     5,
		NumberOfLikes: 5,
	}
	commentResult, err := commentsCollection.InsertOne(ctx, theComment)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Inserted %v documents into comments collection!\n", commentResult.InsertedID)
	fmt.Printf("Inserted %v documents into episode collection!\n", commentResult)
	fmt.Printf("Inserted %v documents into episode collection!\n", postsResult)

}
