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

*MVC*

1. **Frontend (View of the overall system)**:
   - This is where users interact with the application. The frontend sends and receives data to and from the various services, acting as a composite view which may aggregate information from multiple controllers.

2. **User/Profile Service (MVC)**:
   - **Model**: Manages user data and profiles, including operations for creation, retrieval, update, and deletion (CRUD).
   - **View**: Responsible for presenting the user profile data in a consumable format, potentially including web pages or UI components dedicated to user profile information.
   - **Controller**: Handles HTTP requests relating to user profiles, invoking the appropriate model operations and returning the data to the frontend.

3. **Post Service (MVC)**:
   - **Model**: Contains the business logic and data access layer for user posts. It defines the structure and behavior of the data related to posts.
   - **View**: Renders the post data when requested, which could be a part of the user's profile page or a separate page for individual posts.
   - **Controller**: Processes commands concerning posts, such as creating a new post or deleting an existing one, and interacts with the model to carry out these operations.

4. **Feed/Content Service (MVC)**:
   - **Model**: Handles the logic for aggregating content to be displayed in the user's feed. This might involve complex algorithms to personalize content delivery.
   - **View**: Formats and presents the feed data, which might include a collection of posts, images, and other content types.
   - **Controller**: Receives requests to get the feed content, communicates with the model to get the personalized feed, and sends it to the frontend to be displayed.

5. **Notifications Service (MVC)**:
   - **Model**: Manages the storage and state of notifications. It also contains the rules for when notifications should be generated and sent.
   - **View**: Represents the notification data, possibly through an interface where users can view and interact with their notifications.
   - **Controller**: Detects events that require notifications and instructs the model to create and store these notifications. It might also handle the delivery of notifications to the user interface.
  
*Dedicated Databases*

1. **Decoupling**: Each service operates independently of the others. This decoupling means that changes to one service’s database schema or data access patterns do not affect other services.

2. **Scalability**: Individual databases allow each service to scale its data storage and processing capabilities independently, based on its specific load and performance requirements.

3. **Optimized Data Models**: Services can optimize their database schemas based on their unique needs without having to accommodate the data requirements or access patterns of other services.

4. **Resilience**: Isolated databases contribute to fault tolerance. If one service’s database encounters an issue, it won’t directly impact the availability or performance of the other services' databases.

5. **Data Security**: Separation of databases can enhance security. Each service controls its own data, reducing the risk of a security breach affecting all data across the system.

6. **Maintainability**: Independent databases simplify maintenance operations. Upgrades, backups, migrations, and tuning can be performed per service without coordinating with other teams or services.

Using separate databases aligns well with the microservice and modular architecture principles, providing a strong boundary that enforces the independence of each service.

**Design Artifacts**

***Software Architecture Diagram***

<img width="920" alt="PNG image" src="https://github.com/Sabayara82/Rycho/assets/95236604/cabd327d-f27e-47f4-aa65-59c7d62d181c">


***Sequence Diagram***

<img width="920" alt="PNG image" src="https://github.com/Sabayara82/Rycho/assets/95236604/9061b968-6abe-464c-b41d-09b0434ed1ca">



***Non-OOP Justification***

Given the scenario where you have separate MVC (Model-View-Controller) components and databases for each part of the system, the overall aim is for a modular architecture, though not strictly adhering to microservices. Object-Oriented Programming (OOP) is a paradigm that is based on the concept of "objects", which can contain data in the form of fields/attributes and code, in the form of procedures/methods.

Here are our reasons why OOP is not an optimal choice for this kind of project:

1. **Tight Coupling**: OOP can lead to tight coupling if not carefully managed. If objects are designed to be too dependent on one another, changes in one part of the system can have a ripple effect, requiring changes in many other parts of the system. In a setup where we want each MVC component to be as independent as possible, tight coupling goes against the desired modularity.

2. **Shared State**: OOP typically encourages encapsulation of state and behavior. However, in distributed systems, shared mutable state is a source of complexity and potential errors. Different components holding state independently, as in our system, can help avoid the issues that shared state can cause.

3. **Scalability**: OOP systems often struggle to scale horizontally (across multiple machines or processes), which is typically a requirement for distributed systems like the one you're describing. OOP is traditionally more suited to vertical scaling (making a single system more powerful).

4. **Concurrency**: Managing concurrency can be complex in OOP because of the need to manage the state that is encapsulated within objects. A more decoupled, message-passing approach, such as the one typically found in microservices or Actor-based systems, can handle concurrency more naturally.

5. **Complexity Management**: OOP can sometimes add unnecessary complexity. As our system has clearly defined boundaries where each module has a specific role, a simpler procedural or functional approach could result in more maintainable and understandable code.

In summary, while OOP can be used in distributed systems, it often requires additional patterns and practices to fit well with a modular, loosely-coupled architecture. If the system you're building benefits from clear module boundaries, independent scalability, and the need for diverse data stores, it might be better served by other paradigms better aligned with those requirements, such as functional programming, event-driven architecture, or service-oriented architecture.


