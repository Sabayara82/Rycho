import FeedItem from '../../app/feed/FeedItem';
interface roomItems{
    roomId: number; 
    roomTitle: string;
    roomDescription: string;
    theFeedItems: FeedItem[];
}

export default roomItems;