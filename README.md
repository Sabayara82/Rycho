# Rycho
Rycho is an audio sharing social media application for music and podcast enthusiasts. 

# Design

**RTM**

| Requirement          | Description                                                                                       | Rationale                                                                                                                                                                                                                        | Functional Specification                                                                                                   | Priority (1/high | Requirement Met |
| -------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------------- |
| \- 4/low)            |
| Spotify Approval     | Client interacts with frontend to create token for use throughout app                             | To enable secure and personalized access to Spotify's API for streaming and managing music within the app, ensuring compliance with Spotify's authentication protocols.                                                          | API interaction within frontend to create token                                                                            | 1                | Functional      |
| User Profile         | User should be able to post and delete posts to their Profile.                                    | To provide users with control over their content and personal expression within the platform, thereby enhancing user engagement and ensuring a dynamic and personalized experience.                                              | Implemented through User MVC (POST, GET, DELETE, etc. controller functions)                                                | 1                | Functional      |
| Social Connections   | Users should be able to follow and unfollow other profiles.                                       | To foster a community environment by allowing users to curate their network and stay updated with content from peers they are interested in, thereby increasing user interaction and platform stickiness.                        | Followers and following apart of Profile created associated with User                                                      | 3                | Functional      |
| Feed                 | Listing of following user’s posts in chronological order. Users should like and comment on posts. | To maintain an active and engaging user community by ensuring the feed reflects timely content from connections, thereby encouraging interaction and keeping the user base engaged with the most recent discussions and updates. | Using controller functions similar to User Profile, access and display followings’ posts                                   | 2                | Functional      |
| Notification         | Upon liking, commenting, following, post interactions, the user should receive a notification.    | To promptly inform users of engagement on their content or updates in their network, which encourages continued interaction and fosters a responsive and connected user experience.                                              | Functions created in controller with a frontend implementation, called in Feed view                                        | 4                | Functional      |
| Search Functionality | Should be able to search for users, songs, and your own playlists.                                | To provide an efficient way for users to navigate and access a wide range of content, enhancing user experience by simplifying the discovery of new music, connections, and personal collections.                                | Implemented within Post service, Feed, and User Profile to search for playlists and other users                            | 1                | Functional      |
| Modularity           | reusable code across controllers, frontend, etc.                                                  | To ensure a scalable and maintainable codebase that allows for faster development, easier updates, and consistent functionality across different parts of the application.                                                       | Modular code for database connection, frontend, controller functions across Feed, Post, and User Profile                   | 1                | Functional      |
| Reliability          | Reliable and available for consistent use, avoiding system failures and errors.                   | To build user trust and satisfaction by providing a dependable platform that minimizes disruptions and maintains quality service performance at all times.                                                                       | Implementing error messages and status code within NextResponse configurations in tests                                    | 1                | Functional      |
| Performance          | App should be able to handle and accommodate multiple users and concurrent interactions.          | To ensure a smooth, responsive user experience even under heavy load, thus supporting a growing user base and high engagement without compromising service quality.                                                              | Implementing robust User methods to ensure token is being used reliably and adds to database for further use appropriately | 2                | Functional      |


**Architectures Used**


**Design Artifacts**

**Software Architecture Diagram*


**Sequence Diagram*


**Non-OOP Justification*


