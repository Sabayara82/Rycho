import FeedItem from '../FeedItem';
interface roomItems{
    roomId: number; 
    roomTitle: string;
    roomDescription: string;
    theFeedItems: FeedItem[];
}

export default roomItems;