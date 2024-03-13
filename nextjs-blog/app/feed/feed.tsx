import FeedItem from './FeedItem';
import comment from './comment';
import currentUserDetails from './currentUserDetails';
import theUser from './theUser'; 

// an instance of currentUserDetails
const currentUser: currentUserDetails = {
    id: 1,
    userId: 123,
    followingIDs: [456, 789]
};

// an instance of theUser
const users: theUser[] = [
    { id: 456, userName: "User1", theirPosts : [{userId: 456, albumName:"lily", song: "boob", albumUrl: "", createdAt: new Date(), description: "ewurhiwuer", theUser: "sdfdsf", likes: 20, comments: [], postId: 2}]},
    { id: 789, userName: "User2", theirPosts : [{userId: 456, albumName:"rose", song: "bop", albumUrl: "", createdAt: new Date(), description: "adfa", theUser: "fdf", likes: 2, comments: [], postId: 3}]},
    { id: 101, userName: "User3", theirPosts : [{userId: 456, albumName:"deep", song: "drop", albumUrl: "", createdAt: new Date(), description: "sdfdsf", theUser: "ddd", likes: 321, comments: [], postId: 1}]}
];


const theFeed: number[] = [];

for (const user of users) {
    if (currentUser.followingIDs.includes(user.id)) {
        for (const post of user.theirPosts) {
            theFeed.push(post.postId);
        }
    }
}

//next is where we display it, this is after consulting with everyone...

//idea: 
// we take the currentUserDetails, and we take the followingIDs
// then from the followingIDs we iterate through a bigger array of theUsers
// from that bigger array we then see if there is a match between followingIDs
// and the ones in the array. from there we then display the FeedItem array 
// if there is a match and FeedItem then has all the detials