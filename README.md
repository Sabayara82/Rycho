# Rycho
Rycho is an audio sharing social media application for music and podcast enthusiasts. 

# Design

**RTM**

| Requirement          | Description                                                                                       | Rationale                                                                                                                                                                                                                        | Functional Specification                                                                                                   | Priority (1/high - 4/low) | Requirement Met |
| -------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------------- |
|             |
| Spotify Approval     | Client interacts with frontend to create token for use throughout app                             | To enable secure and personalized access to Spotify's API for streaming and managing music within the app, ensuring compliance with Spotify's authentication protocols.                                                          | API interaction within frontend to create token                                                                            | 1                | Functional      |
| User Profile         | User should be able to post and delete posts to their Profile.                                    | To provide users with control over their content and personal expression within the platform, thereby enhancing user engagement and ensuring a dynamic and personalized experience.                                              | Implemented through User MVC (POST, GET, DELETE, etc. controller functions)                                                | 1                | Functional      |
| Social Connections   | Users should be able to follow and unfollow other profiles.                                       | To foster a community environment by allowing users to curate their network and stay updated with content from peers they are interested in, thereby increasing user interaction and platform stickiness.                        | Followers and following apart of Profile created associated with User                                                      | 3                | Functional      |
| Feed                 | Listing of following user’s posts in chronological order. Users should like and comment on posts. | To maintain an active and engaging user community by ensuring the feed reflects timely content from connections, thereby encouraging interaction and keeping the user base engaged with the most recent discussions and updates. | Using controller functions similar to User Profile, access and display followings’ posts                                   | 2                | Functional      |
| Notification         | Upon liking, commenting, following, post interactions, the user should receive a notification.    | To promptly inform users of engagement on their content or updates in their network, which encourages continued interaction and fosters a responsive and connected user experience.                                              | Functions created in controller with a frontend implementation, called in Feed view                                        | 4                | Functional      |
| Search Functionality | Should be able to search for users, songs, and your own playlists.                                | To provide an efficient way for users to navigate and access a wide range of content, enhancing user experience by simplifying the discovery of new music, connections, and personal collections.                                | Implemented within Post service, Feed, and User Profile to search for playlists and other users                            | 1                | Functional      |
| Modularity           | reusable code across controllers, frontend, etc.                                                  | To ensure a scalable and maintainable codebase that allows for faster development, easier updates, and consistent functionality across different parts of the application.                                                       | Modular code for database connection, frontend, controller functions across Feed, Post, and User Profile                   | 1                | Non-Functional      |
| Reliability          | Reliable and available for consistent use, avoiding system failures and errors.                   | To build user trust and satisfaction by providing a dependable platform that minimizes disruptions and maintains quality service performance at all times.                                                                       | Implementing error messages and status code within NextResponse configurations in tests                                    | 1                | Non-Functional      |
| Performance          | App should be able to handle and accommodate multiple users and concurrent interactions.          | To ensure a smooth, responsive user experience even under heavy load, thus supporting a growing user base and high engagement without compromising service quality.                                                              | Implementing robust User methods to ensure token is being used reliably and adds to database for further use appropriately | 2                | Non-Functional      |


**Architectures Used**


**Design Artifacts**

***Software Architecture Diagram***

<img width="920" alt="PNG image" src="https://github.com/Sabayara82/Rycho/assets/95236604/cabd327d-f27e-47f4-aa65-59c7d62d181c">


***Sequence Diagram***

<img width="920" alt="PNG image 2" src="https://github.com/Sabayara82/Rycho/assets/95236604/a792a6fa-d75a-4b82-b3c8-d90eeb426f8e">


***Non-OOP Justification***

Given the scenario where you have separate MVC (Model-View-Controller) components and databases for each part of the system, the overall aim is for a modular architecture, though not strictly adhering to microservices. Object-Oriented Programming (OOP) is a paradigm that is based on the concept of "objects", which can contain data in the form of fields/attributes and code, in the form of procedures/methods.

Here are our reasons why OOP is not an optimal choice for this kind of project:

1. **Tight Coupling**: OOP can lead to tight coupling if not carefully managed. If objects are designed to be too dependent on one another, changes in one part of the system can have a ripple effect, requiring changes in many other parts of the system. In a setup where we want each MVC component to be as independent as possible, tight coupling goes against the desired modularity.

2. **Shared State**: OOP typically encourages encapsulation of state and behavior. However, in distributed systems, shared mutable state is a source of complexity and potential errors. Different components holding state independently, as in our system, can help avoid the issues that shared state can cause.

3. **Scalability**: OOP systems often struggle to scale horizontally (across multiple machines or processes), which is typically a requirement for distributed systems like the one you're describing. OOP is traditionally more suited to vertical scaling (making a single system more powerful).

4. **Concurrency**: Managing concurrency can be complex in OOP because of the need to manage the state that is encapsulated within objects. A more decoupled, message-passing approach, such as the one typically found in microservices or Actor-based systems, can handle concurrency more naturally.

5. **Complexity Management**: OOP can sometimes add unnecessary complexity. As our system has clearly defined boundaries where each module has a specific role, a simpler procedural or functional approach could result in more maintainable and understandable code.

In summary, while OOP can be used in distributed systems, it often requires additional patterns and practices to fit well with a modular, loosely-coupled architecture. If the system you're building benefits from clear module boundaries, independent scalability, and the need for diverse data stores, it might be better served by other paradigms better aligned with those requirements, such as functional programming, event-driven architecture, or service-oriented architecture.


