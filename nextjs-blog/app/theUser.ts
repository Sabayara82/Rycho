import FeedItem from './FeedItem';
interface theUser {
    id: number;
    userName: string;
    theirPosts: FeedItem[];
}

export default theUser;