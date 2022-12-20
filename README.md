
  

# Welcome to DevTube-API - a Youtube API replica I have developed with Node.js & Express.js

  
  

## Dependencies



- MongoDB

  

## Description

DevTube-API is a Youtube API replica that I have developed with Node.js & Express.js.

DevTube-API built with Express.js (Node.js framework) and uses MongoDB.

This api uses Json Web Token (JWT) to sign-in users, cookie-parser to store cookies, bcryptjs to encrypt user's passwords and to store it in MongoDB.

You can read about the endpoints on the Endpoints section.

## Endpoints

- `/api/auth`
	- `/signup` - Create user. POST
	- `/signin` - Sign in. POST
	- `/google` - Google Authentication. POST
- `/api/users`

	- `/:id` - Update user. PUT
	- `/:id` - Delete user. DELETE
	- `/find/:id` - Get a user. GET
	- `/sub/:id` - Subscribe to user. PUT
	- `/unsub/:id` - Unsubscribe from user. PUT
	- `/like/:videoId` - Like a video. PUT
	- `/dislike/:videoId` - Dislike a video. PUT

- `/api/videos`

	- `/` - Add video. POST
	- `/:id` - Update video. PUT
	- `/:id` - Delete video. DELETE
	- `/find/my-videos/:id` - Get my videos. GET
	- `/find/:id` - Get video. GET
	- `/view/:id` - Increase video's view by 1. PUT
	- `/trend` - Get most trend videos. GET
	- `/random` - Get random videos. GET
	- `/sub` - Get all videos from the channels you have subscribed to. GET
	- `/search` - Search videos by title. GET
	- `/:id/tags` - Get videos by Hashtags. GET
	- `/:tag` - Get Videos by Hashtag. GET

- `/api/comments`

	- `/` - Add comment. POST

	- `/:id` - Delete comment. DELETE

	- `/:videoId` - Get comments from a video. GET

  

## Environment Variables

- MONGODB_URI - MongoDB URI including username, password and port number. Example: mongodb://root:example@mongo:27017/

- SECRET_JWT_KEY - Secret Json Web Token Key. Example: "VerySecretExample"

  

## Available Scripts

In the project directory, you can run:

### `npm start`

  

Runs the app in the development mode.\

  

Open [http://localhost:5000](http://localhost:5000) to view it in your API.

  

The page will reload when you make changes.\

  

You may also see any lint errors in the console.

  

### `docker build -t <image-name> .`

Creates a docker image of DevTube API.

  

### `docker-compose up`

Will build DevTube API image and MongoDB image and run them on two separated containers that shares the same network.
DevTube API will be exposed on port 3001, while the MongoDB won't be accessible from an outsider network.