import mongoose from "mongoose";

const postItemSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        required: true
    },
    songName: {
        type: String 
    }, 
    albumName: {
        type: String
    },
    artistName: {
        type: String 
    },
    imageURL: {
        type: String
    },
    audioURL: {
        type: String
    },
    caption: {
        type: String
    },
    likes: {
        type: Number
    },
    roomStat: {
        type: Boolean
    },
    comments: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const connection = mongoose.createConnection(process.env.MONGO_URI!+'feed');
const Post = connection.models.posts || connection.model("posts", postItemSchema);

export default Post;