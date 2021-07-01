## Welcome to Game Night!

![Game Night Photo](https://dereklouis.github.io/photos/gamenight/gamenight0.jpg)

Game Night is a virtual game night management application that makes hosting game nights quick and easy for everyone.

No need to make an account, just enter your name one time and Game Night will remember you thanks to local storage. Once you confirm that you will be attending the game night, you will be assigned a randomized dog avatar and placed in the waiting room. Watch as other players file into the waiting room and fill up the chairs one by one, until the host opens the room. Once in the game room, players have access to the zoom link, any room codes, and three votes to vote for their games of choice. Game night will award 1st, 2nd and 3rd place medals to the games with the highest respective vote counts.

What if you (the usual host) is away and somebody else needs to take over hosting duties? Game Night makes access to the Admin Panel easy by utilizing a secret key combination to render it, rather than giving certain accounts admin privieges. Game Night utilizes socket.io to ensure that every update to the database is emitted to every connected player in real time.

## Video Walkthrough

[![Video walkthrough for Pasta Friends](https://img.youtube.com/vi/xUTlEjmI1WI/0.jpg)](http://www.youtube.com/watch?v=xUTlEjmI1WI)

## Getting Started

First, create the database 'gamenight' on your local machine. Then, in the gamenight directory run 'npm run start-dev' to seed the database, launch the back end, and launch the front end. Open [http://localhost:3000](http://localhost:3000) to view Game Night in the browser.

Use the key command 'CRTL + G + N' to open the Admin Access Panel and manage Game Night.

## Available Scripts

In the project directory, you can run:

### `npm run start-dev`

Seeds the database (if necessary), launches the back end, launches the front end.
Open [http://localhost:3000](http://localhost:3000) to view Game Night in the browser.

### `npm start`

Launches the back end only.

### `npm run client`

Launches the front end only.

## Deployment

Game Night is currently deployed on Heroku: https://game--night.herokuapp.com/
