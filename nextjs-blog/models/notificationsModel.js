import mongoose from "mongoose";

const NotificationsSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    FromUserId: {
        type: String,
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


const connection = mongoose.createConnection(process.env.MONGO_NOT);
const Notifications = connection.models.notifications || connection.model("notifications", NotificationsSchema);

// const Notifications = mongoose.models.notifications || mongoose.model("notifications", NotificationsSchema);

export default Notifications;

