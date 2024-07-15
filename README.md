# Chess Classic

A full-featured chess application that allows players to play local games, online games, or against an AI engine. Built using Mongoose, Express, Socket.io, and React.

## Features

- **Local Games**: Play chess against another player on the same device.
- **Online Games**: Play chess against players online.
- **Engine Games**: Play chess against an AI engine.
- **Real-time Updates**: Game state updates in real-time using Socket.io.
- **Persistent Data**: Move history stored in MongoDB for "online" games only.
- **Game Timer**: Each player has a timer to keep track of their move time, supporting different game modes defined by timer length.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **WebSockets**: Socket.io
- **Database**: MongoDB, Mongoose
- **Chess Logic**: Chess.js

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/chess-classic.git
   cd chess-classic
   ```

## Usage

1. **Local Games:**

   - Select the "local" option from the "PLAY" button dropdown.
   - Play against another player on the same device.

2. **Online Games:**

   - Select the "online" option from the PLAY button dropdown.
   - Select an timer option either 1,3,5, or 10.
   - You are then placed with any waiting players of the same timer option, or prompted to wait yourself.
   - Game begins on timer selection; player color is random.
   - Play against another player online.

3. **Engine Games:**

   - Select the "engine" option from the main menu.
   - Select an timer option either 1,3,5, or 10.
   - Game begins on timer selection; player color is random.
   - Play against the AI engine.

4. **Timer:**

   - Each player has a timer to track their move time.
   - Choose different game modes with varying time controls.

## Project Structure

/chess-classic
├── /client
│ ├── /my-chess-app
│ │ ├── /public
│ │ ├── /src
│ │ │ ├── /components
│ │ │ │ ├── Alert.jsx
│ │ │ │ ├── ButtonDropdown.jsx
│ │ │ │ ├── ChessClock.js
│ │ │ │ ├── Dotdotdot.jsx
│ │ │ │ ├── Options.jsx
│ │ │ ├── App.css
│ │ │ ├── App.js
│ │ │ ├── index.js
│ │ ├── package.json
├── /server
│ ├── /chess-engine
│ │ ├── minimax.js
│ │ ├── pieceEval.js
│ ├── /models
│ │ ├── ChessGame.js
│ ├── /routes
│ │ ├── chessRoutes.js
│ ├── /utils
│ ├── server.js
│ ├── .env
│ ├── package.json
├── README.md
