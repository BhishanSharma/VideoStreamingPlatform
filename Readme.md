# 🎬 Video Streaming Platform Backend

## 📖 Overview

This repository contains the backend implementation of a video streaming platform. It serves as a comprehensive backend solution for handling user authentication, video uploads, playlists, comments, likes, and subscriptions. The platform is designed to provide a seamless experience for users to interact with video content, similar to popular streaming services.

## 🧱 Core Features

* **User Authentication**: Secure user registration and login using JWT tokens.
* **Video Management**: Upload, edit, and delete videos with metadata.
* **Playlist Management**: Create, update, and delete playlists; add/remove videos to/from playlists.
* **Comments System**: Users can post, edit, and delete comments on videos.
* **Likes System**: Users can like or unlike videos, comments, and tweets.
* **Subscriptions**: Users can subscribe to or unsubscribe from channels.

## 🛠 Technologies Used

* **Node.js**: JavaScript runtime for building the backend.
* **Express.js**: Web framework for building RESTful APIs.
* **MongoDB**: NoSQL database for storing user and video data.
* **Cloudinary**: Cloud service for storing and managing media assets.
* **JWT (JSON Web Tokens)**: For secure user authentication.
* **Mongoose**: ODM for MongoDB to model data.
* **Prettier**: Code formatter to maintain code consistency.

## 🚀 Getting Started

### Prerequisites

* Node.js (version 14 or higher)
* MongoDB (local or cloud instance)
* Cloudinary account for media storage

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/BhishanSharma/VideoStreamingPlatform.git
   cd VideoStreamingPlatform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following:

   ```
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_URL=your_cloudinary_url
   MONGO_URI=your_mongodb_connection_string
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The server will be running at `http://localhost:5000`.

## 🧪 API Endpoints

### User Routes

* **POST** `/api/v1/users/register`: Register a new user.
* **POST** `/api/v1/users/login`: Login an existing user.

### Video Routes

* **POST** `/api/v1/videos`: Upload a new video.
* **GET** `/api/v1/videos/:id`: Get a specific video by ID.
* **PATCH** `/api/v1/videos/:id`: Edit video details.
* **DELETE** `/api/v1/videos/:id`: Delete a video.

### Playlist Routes

* **POST** `/api/v1/playlists`: Create a new playlist.
* **GET** `/api/v1/playlists`: Get all playlists.
* **GET** `/api/v1/playlists/:id`: Get a specific playlist by ID.
* **PATCH** `/api/v1/playlists/:id`: Edit playlist details.
* **DELETE** `/api/v1/playlists/:id`: Delete a playlist.

### Comment Routes

* **POST** `/api/v1/comments/:videoId`: Add a comment to a video.
* **GET** `/api/v1/comments/:videoId`: Get all comments for a video.
* **PATCH** `/api/v1/comments/:id`: Edit a comment.
* **DELETE** `/api/v1/comments/:id`: Delete a comment.

### Like Routes

* **POST** `/api/v1/likes/:targetId`: Like a video, comment, or tweet.
* **DELETE** `/api/v1/likes/:targetId`: Unlike a video, comment, or tweet.

### Subscription Routes

* **POST** `/api/v1/subscriptions/:channelId`: Subscribe to a channel.
* **DELETE** `/api/v1/subscriptions/:channelId`: Unsubscribe from a channel.
* **GET** `/api/v1/subscriptions`: Get all subscriptions.

## 🔐 Authentication Middleware

The project uses JWT for user authentication. The `verifyJWT` middleware is applied to routes that require authentication. It ensures that the user is logged in and has a valid token before accessing protected resources.

## 📂 Project Structure

```
VideoStreamingPlatform/
├── src/
│   ├── controllers/       # Route handlers
│   ├── models/            # Mongoose models
│   ├── routes/            # Express route definitions
│   ├── middlewares/       # Custom middlewares
│   ├── utils/             # Utility functions
│   └── config/            # Configuration files
├── public/                # Public assets
├── .env                   # Environment variables
├── package.json           # Project metadata and dependencies
└── README.md              # Project documentation
```

## 🧑‍💻 Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request with a detailed description of your changes.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
