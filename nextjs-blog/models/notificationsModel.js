import mongoose from "mongoose";

const NotificationsSchema = new mongoose.Schema({
    Id: {
        type: ObjectId,
        required: true,
        unique: true
    },
    postId: {
        type: ObjectId,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    FromUserId: {
        type: ObjectId,
        required: true
    },
    Text: {
        type: String,
        required: false
    },
    Time: {
        type: Date,
        required: true
    }
});

const Notifications = mongoose.models.notifications || mongoose.model("notifications", NotificationsSchema);

export default Notifications;

