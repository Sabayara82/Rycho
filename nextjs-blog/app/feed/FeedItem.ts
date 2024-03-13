import comment from './comment';
interface FeedItem {
    userId: number;
    albumName: string;
    song: string;
    albumUrl: string;
    createdAt: Date;
    description: string;
    theUser: string; 
    likes: number;
    comments: comment[];
    postId: number;
    roomStat: boolean; 

}

export default FeedItem;
