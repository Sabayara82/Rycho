interface FeedItem {
    id: number;
    albumName: string;
    song: string;
    albumUrl: string;
    createdAt: Date;
    description: string;
    theUser: string; 
    likes: number;
    comments: Comment[];

}

export default FeedItem;
