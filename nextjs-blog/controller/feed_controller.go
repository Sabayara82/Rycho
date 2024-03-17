package controller

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

// use these in functions
client := app.feed.maintest();
feedDatabase := client.Database("feed")
postsCollection := feedDatabase.Collection("posts")
commentsCollection := feedDatabase.Collection("comments")

// get all feed items associated with a userID
func getAllFeedItems() gin.HandlerFunc {
    return func (c *gin.Context) {
        ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
        defer cancel()

        // get userID requesting the items
        userIDParam := c.Param("UserID")
        userID, err := primitive.ObjectIDFromHex(userIDParam)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userID format"})
            return
        }

        // Find all feed items that belong to the userID
        var feedItems []FeedItem // Use bson.M if you want to return the raw bson, or use defined struct
        cursor, err := postsCollection.Find(ctx, bson.M{"userId": userID})
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        if err = cursor.All(ctx, &feedItems); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        // If no items are found, return an empty array
        if feedItems == nil {
            feedItems = []FeedItem{}
        }

        c.JSON(http.StatusOK, gin.H{"data": feedItems})
    }
}

// get a feed item by its ID
func getFeedItemByID() in.HandlerFunc {
    return func (c *gin.Context) {
        ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
        defer cancel()

        feedItemIDParam := c.Param("ID")
        feedItemID, err := primitive.ObjectIDFromHex(feedItemIDParam)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "invalid feed item ID format"})
            return
        }

        // Find the feed item by its ID
        var feedItem FeedItem // Use bson.M to represent the feed item as a map, or define a struct for your feed items
        err = postsCollection.FindOne(ctx, bson.M{"_id": feedItemID}).Decode(&feedItem)
        if err != nil {
            if err == mongo.ErrNoDocuments {
                c.JSON(http.StatusNotFound, gin.H{"error": "feed item not found"})
            } else {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            }
            return
        }

        // Return the feed item
        c.JSON(http.StatusOK, gin.H{"data": feedItem})
    }
}

// create a feed item using the struct and associate it with a UserID to populate database
func createFeedItem() in.HandlerFunc {
    return func (c *gin.Context) {
        ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
        defer cancel()

        // Parse the JSON request body into the FeedItem struct
        var feedItem FeedItem
        if err := c.ShouldBindJSON(&feedItem); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        userID, err := strconv.ParseInt(c.Param("userID"), 10, 32)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "invalid UserID"})
            return
        }
        feedItem.UserID = int32(userID)

        // Insert the new feed item into the database
        result, err := postsCollection.InsertOne(ctx, feedItem)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        // Return the result
        c.JSON(http.StatusCreated, gin.H{"data": result})

    }
}

// update a feed item using its ID
func updateFeedItem() in.HandlerFunc {
    return func (c *gin.Context) {
        ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
        defer cancel()

        // Extract the feed item ID from the request parameters
        feedItemIDParam := c.Param("ID")
        feedItemID, err := strconv.ParseInt(feedItemIDParam, 10, 32)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "invalid feed item ID format"})
            return
        }

        // Parse the JSON request body into the FeedItem struct
        var updatedData bson.M
        if err := c.ShouldBindJSON(&updatedData); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        // Get the feed items collection
        feedDatabase := client.Database("feed")
        postsCollection := feedDatabase.Collection("posts")

        // Update the feed item
        // We are using bson.M to update only the fields that were provided in the request
        // $set allows for multiple fields to be updated at a time
        filter := bson.M{"_id": int32(feedItemID)}
        update := bson.M{"$set": updatedData}
        result, err := postsCollection.UpdateOne(ctx, filter, update)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        // Check if the update was successful
        if result.MatchedCount == 0 {
            c.JSON(http.StatusNotFound, gin.H{"error": "feed item not found"})
            return
        }

        // Return the result
        c.JSON(http.StatusOK, gin.H{"data": "feed item updated successfully"})
    }

    // delete a feed item by its ID
    func deleteFeedItem() in.HandlerFunc {
        return func (c *gin.Context) {
            ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
            defer cancel()

            // Extract the feed item ID from the request parameters
            feedItemIDParam := c.Param("ID")
            feedItemID, err := strconv.ParseInt(feedItemIDParam, 10, 32)
            if err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": "invalid feed item ID format"})
                return
            }

            // Delete the feed item by its ID
            filter := bson.M{"_id": int32(feedItemID)}
            result, err := postsCollection.DeleteOne(ctx, filter)
            if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }

            // Check if the item was successfully deleted
            if result.DeletedCount == 0 {
                c.JSON(http.StatusNotFound, gin.H{"error": "feed item not found"})
                return
            }

            // Return a success message
            c.JSON(http.StatusOK, gin.H{"message": "feed item deleted successfully"})
        }
    }
}
