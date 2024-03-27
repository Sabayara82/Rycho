import mongoose from "mongoose";

const favSongScheme = new mongoose.Schema({
    spotifyId: { 
        type: String,
        required: true
    }, 
    audioURL: {
        type: String, 
        required: true
    }, 
    artistName: {
        type: String
    }, 
    songName: {
        type: String, 
        required: true
    }
}, {
    timestamps: true
});

const connection = mongoose.createConnection(process.env.MONGO_URI!+'feed');
const favSong = connection.models.comments || connection.model("favSong", favSongScheme);

export default favSong;