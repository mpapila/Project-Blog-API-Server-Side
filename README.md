# Blog API Server

This is the backend server for a blog application built with Express, TypeScript, and Prisma, using MySQL as the database. The server provides RESTful API endpoints for managing users, posts, and comments.

## Technologies Used
- Node.js
- Express
- TypeScript
- Prisma
- MySQL
- JWT for authentication

## Features
- User authentication with JWT
- CRUD operations for users, posts, and comments
- Input validation and error handling
- Middleware for token verification
- Prisma ORM for database interactions

### API Endpoints
#### Users
- `POST /user/new`: Create a new user
- `POST /user/login`: Login a user and get a JWT
- `GET /users`: Get user details (requires token)

#### Posts
- `GET /posts`: List all posts
- `POST /posts/new`: Create a new post (requires token)
- `GET /posts/:id`: Get details of a specific post
- `PUT /posts/:id`: Edit a post (requires token)

#### Comments
- `POST /posts/:id/comment/new`: Add a comment to a post (requires token)

## License
This project is licensed under the ISC License.
