<h1 align="center">
Project GiveMovies - Backend

</h1>

</br>

<p align="center">
	<img alt="Last Commit" src="https://img.shields.io/github/last-commit/ErwanPel/GiveMovies_Backend_ReactNative.svg?style=flat-square">
	<img alt="Licence" src="https://img.shields.io/github/license/ErwanPel/GiveMovies_Backend_ReactNative.svg?style=flat-square">
	<img alt="Star" src="https://img.shields.io/badge/you%20like%20%3F-STAR%20ME-blue.svg?style=flat-square">
</p>




## Overview

This is my first personal full-stack project using TypeScript. I wanted to create a mobile application to consult a list of films, allowing users to post and consult reviews with a like/dislike system and the possibility for each user to manage his or her profile. I also set up a "Random Movies" mode to help the user to choose a movie if inspiration fails. 
</br>

This project manages routes for :

1) User registration and connection.
2) Add, delete or modify profile photo.
3) Delete user account.
4) Get a list of films, a specific film.
5) Get a list of reviews in chronological order.
6) Publish, modify or delete a review.
7) Add/delete a like/dislike.

</br>

Backend development uses TypeScript with Node.js and Express.js / MongoDB servers for database management (mongoose package). This server uses 18 routes to perform the above tasks.

</br>
This project uses the Movies API of bootcamp "Le Reacteur" and requires an API key to obtain the movies.
The "isAuthenticated" middleware ensures that each user has a secure connection to the application.
In development, TypeScript is used to check variables, and the Zod package dynamically checks the input/output of promises.

## Installation and usage

Be sure, you have installed [Node.js](https://nodejs.org/en). You have to install the "LTS" version.

### Running the project

Clone this repository :

```
git clone https://github.com/ErwanPel/GiveMovies_Backend_ReactNative.git
cd GiveMovies_Backend_ReactNative
```

Install packages :

```
npm install

```

When installation is complete, You need to create a nodemon.json file at the root of the project and add this line of code to enable the TypeScript compiler to run the server properly :

```
{
  "execMap": {
    "ts": "ts-node --files"
  }
}

```
After, you can write on the terminal  :

```
npx nodemon server.ts

```


You can test different server routes with software such as [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/).

You can see the client side for this Project GiveMovies [here](https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative).

## Star, Fork, Clone & Contribute

Feel free to contribute on this repository. If my work helps you, please give me back with a star. This means a lot to me and keeps me going!
