# UnderTime

## Overview

Sports betting in basketball is incredibly difficult, with bias getting in the way of placing optimal bets. It seems impossible to get it right! That's where "Undertime" comes in!

Undertime is a web app that will allow users to access to top-of-the-line ML software to help place their bets. Users can register and login. Once they're logged in, they can create or view their potential bets – and what UnderTime has to say about it, 

## Data Model

The application will store Users and their Analyzed Bets

* users can have multiple bets (via references)
* each bet can have multiple algorithms of analysis (by embedding)

An Example User:

```javascript
{
  username: "bettybetter",
  hash: // a password hash,
  lists: // an array of references to List documents
}
```

An Example Bet:

```javascript
{
  user: // a reference to a User object
  name: "Bet1",
  teams: ["Golden State Warriors", "Utah Jazz"]
  analysis: [
    { name: "Neural Network", predicted_score: [96, 78]},
    { name: "KNN", predicted_score: [98, 79]},
  ],
  createdAt: // timestamp
}
```


## [Link to Commented First Draft Schema](db.js) 

## Wireframes

/ - home page explaining the site

![home](documentation/home.png)

/games/create - page for analyzing a new game

![list create](documentation/add.png)

/games - page for showing all analyzed games

![list](documentation/bets.png)

## Site map

![map](documentation/map.png)

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can run analysis on a game, specifying what algorithms to use
4. as a user, I can view all of the games I have analyzed

## [Link to Initial Main Project File](app.js) 
