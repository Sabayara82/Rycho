package main

import (
	"encoding/json"
	"os"
	"time"
)

// Creating the global variables
var (
	testUser  currentUserDetails
	feedItems []FeedItem
)

// Random testing function
func feed__init() {
	testUser = currentUserDetails{
		id:           1,
		userName:     "nessma",
		followingIds: []int32{456, 789},
	}

	feedItems = []FeedItem{
		{
			ID:              33,
			UserID:          789,
			AlbumName:       "Album 1",
			Song:            "Song 1",
			AlbumURL:        "https://example.com/album1",
			CreatedAt:       int32(time.Now().Unix()),
			Caption:         "This is the first item",
			Likes:           10,
			RoomStat:        true,
			ArrOfCommentIDs: []int32{1, 2, 3},
		},
		{
			ID:              9,
			UserID:          789,
			AlbumName:       "Album 2",
			Song:            "Song 2",
			AlbumURL:        "https://example.com/album2",
			CreatedAt:       int32(time.Now().Unix()),
			Caption:         "This is the second item",
			Likes:           20,
			RoomStat:        false,
			ArrOfCommentIDs: []int32{4, 5},
		},
		{
			ID:              4,
			UserID:          789,
			AlbumName:       "Album 3",
			Song:            "Song 3",
			AlbumURL:        "https://example.com/album2",
			CreatedAt:       int32(time.Now().Unix()),
			Caption:         "This is the third item",
			Likes:           234,
			RoomStat:        false,
			ArrOfCommentIDs: []int32{4},
		},
		{
			ID:              3,
			UserID:          1,
			AlbumName:       "Album 3",
			Song:            "Song 3",
			AlbumURL:        "https://example.com/album2",
			CreatedAt:       int32(time.Now().Unix()),
			Caption:         "This is the third item",
			Likes:           33,
			RoomStat:        false,
			ArrOfCommentIDs: []int32{4},
		},
	}
}

// parsing returns
func parseJSONFile(filename string) (map[string]interface{}, error) {
	// Open the JSON file
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// Create a map to store the parsed JSON data
	data := make(map[string]interface{})

	// Decode the JSON file into the map
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&data); err != nil {
		return nil, err
	}

	return data, nil
}

// Comment movement
func retrieveComments(postID int32) []Comment {
	// the instance is a json file so we need to parse through that
	instance := getFeedItemById(postID)
	theComments := make([]Comment, 0)
	comments := instance.ArrOfCommentIDs
	for _, commentID := range comments {
		theComments = append(theComments, getCommentById(commentID))
	}
	return theComments
}

func retrieveCommentInfo(commentIndex int32, postID int32) string {
	theComments := retrieveComments(postID)
	return theComments[commentIndex].Comment
}

// another way to retrive the updated stuff
func retrieveCommentLikes(commentId int32, postID int32) int32 {
	theComments := retrieveComments(postID)
	return theComments[commentIndex].NumberOfLikes
}

func commentLikeIncrease(commentId int32, postID int32) {
	theComments := retrieveComments(postID)
	value = theComments[commentIndex].NumberOfLikes + 1
	updateCommentLikes(commentId, value)
}

func commentLikeRemoval(commentId int32, postID int32) {
	theComments := retrieveComments(postID)
	theComments[commentIndex].NumberOfLikes
	value = theComments[commentIndex].NumberOfLikes - 1
	updateCommentLikes(commentId, value)
}

// Feed Movement
func findingPosts() []int32 {
	var matchedIDs []int32
	var users = testUser.id
	for _, item := range feedItems {
		for _, id := range testUser.followingIds {
			if (item.UserID == id) || (users == item.UserID) {
				matchedIDs = append(matchedIDs, item.ID)
				break
			}
		}
	}
	return matchedIDs
}

func FeedScrolling(userID int32) []FeedItem {
	//order by date
	matchedIDs := findingPosts()
	thePosts := make([]FeedItem, 0)
	for _, postID := range matchedIDs {
		thePosts = append(thePosts, getFeedItemById(matchedIDs))
	}
	return thePosts
}

func findFeedItemByUserID(feedItems []FeedItem, targetUserID int32) *FeedItem {
	for _, item := range feedItems {
		if item.UserID == targetUserID {
			return &item
		}
	}
	return nil
}

// Singular Post Interaction
func getConnet(postID int32, userID int32) map[string]string {
	instance := FeedScrolling(userID)
	foundItem := findFeedItemByUserID(instance, postID)
	connet := make(map[string]string)
	if foundItem != nil {
		connet["AlbumName"] = foundItem.AlbumName
		connet["AlbumURL"] = foundItem.AlbumURL
		connet["Caption"] = foundItem.Caption
		connet["Song"] = foundItem.Song
	}
	return connet
}

func addLike(postID int32, userID int32) {
	instance := FeedScrolling(userID)
	foundItem := findFeedItemByUserID(instance, postID)
	likes := foundItem.Likes + 1
	updatePostLikes(postID, likes)

}

func removeLike(postID int32, userID int32) {
	instance := FeedScrolling(userID)
	foundItem := findFeedItemByUserID(instance, postID)
	likes := foundItem.Likes - 1
	updatePostLikes(postID, likes)

}

func unfollowUser(userID int32, unfollowUserID int32) {
	// this is to be created once we connect everything together
}

func main() {
	maintest()
	feed__init()
	findingPosts()
}
