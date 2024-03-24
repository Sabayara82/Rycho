import mongoose from "mongoose";

const commentItemSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true
    },
    spotifyId: { 
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    numerOfLikes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const connection = mongoose.createConnection(process.env.MONGO_URI!+'feed');
const Comment = connection.models.comments || connection.model("comments", commentItemSchema);

export default Comment;