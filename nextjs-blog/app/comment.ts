interface comment {
    id: number;
    userId: number;
    userName: string;
    comment: string;
    createdAt: Date;
    numberOfLikes: number; 
}

export default comment;