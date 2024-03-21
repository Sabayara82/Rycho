import mongoose from "mongoose";

const postItemSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        required: true
    },
    albumName: {
        type: String
    },
    albumURL: {
        type: String
    },
    songName: {
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
        type: [Number],
        default: []
    }
}, {
    timestamps: true
});

const connection = mongoose.createConnection(process.env.MONGO_URI!+'feed');
const Post = connection.models.posts || connection.model("posts", postItemSchema);

export default Post;