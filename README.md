# Afriscope

# Blog App

This is a simple blog application built with React.js for the frontend and Node.js with Express.js for the backend. It allows visitors to view and read blog posts, while registered users have additional capabilities such as leaving comments and liking/disliking posts. Admin users have full control over managing users, blog posts, comments, categories, and tags.

## Features

- Visitor Functionality:
  - View a list of published blog posts.
  - Read the full content of a blog post.
  - Search for specific blog posts based on keywords or categories.
  - Filter blog posts based on recent posts, date, location, and featured posts.

- User Functionality (in addition to visitor functionality):
  - User registration with email address, username, password, image, and location.
  - User login using email address and password.
  - Comment/reply on blog posts.
  - User profile page for viewing and updating personal information.
  - Like or dislike blog posts.
  - Delete or edit their own comments.

- Admin Functionality (in addition to user functionality):
  - Admin dashboard for managing users, blog posts, comments, and categories/tags.
  - Create and publish blog posts.
  - View, edit, publish, or delete any blog posts.
  - View, edit, publish, or delete any comments on blog posts.
  - Create, edit, or delete categories or tags for organizing blog posts.

## Technologies Used

- Frontend:
  - React.js
  - React Router for routing
  - Axios for making API requests

- Backend:
  - Node.js
  - Express.js for building RESTful APIs
  - Mongoose as the MongoDB object modeling tool
  - JWT (JSON Web Tokens) for user authentication

- Database:
  - MongoDB for storing blog posts, user information, comments, etc.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>

2. Navigate to the backend directory:

    ```bash
    cd blog-backend

3. Install the dependencies:

    ```bash
    npm install

4. Start the backend server:

    ```bash
    npm start

5. Open another terminal and navigate to the frontend directory:

    ```bash
    cd ../frontend

6. Install the dependencies:

    ```bash
    npm install

7. Start the frontend development server:

    ```bash
    npm start

8. Open your browser and access the application at http://localhost:3000.

# Configuration
    . Backend configuration:
    The backend server runs on port 5000 by default. You can modify the port by changing the value of the port variable in server.js.

    .Database configuration:
    The application uses a local MongoDB database by default. You can update the MongoDB connection URL in the server.js file to connect to a different database instance.

# Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.