
# Full-Stack Tic Tac Toe 🎉
<p align="center">
  <img width="686" height="334" src="https://imgtr.ee/images/2023/12/31/08ea1d82545e781eaa018ca2cde84457.png">
</p>
Dear traveler, I would love to present tic tac toe multiplayer game! 

Server 
-
- go to `server` folder
- `npm install`
- `docker-compose up` - to run mongodb
- create file .env and add `VITE_BE_URL=http://localhost:3000`
- `npm run start`

Client 
-
- go to `client` folder
- create file .env and add 

MONGO_URL="mongodb://localhost:27017/tic-tac-toe-db"
SESSION_SECRET="testSecret"
PORT=3000

- `npm install`
- `npm run dev`

Some server bulletpoints:
-
- Server is based on express, socket.io and mongoDB
- Mongodb dockerized
- Whole game logic handled on server side (all moves, board, etc.)
- User auth based on express sessions
- Sockets requires authentication to connect
- Lobby based on memory
- Lobby creates a new game room when includes at least two players (5 seconds timeout)
- By default its pairing two users with the highest score (could pair with lowest  difference in future)
- Server handles disconnecting during the match
- Users are gaining points for wins
- All matches are stored and users have their own history



Some client bulletpoints:
- 
- Client is based on React + Vite + Tailwind + axios
- Tried to make it as simple as possible
- No global store implemented
- Form validator based on custom hook 
- Simple and clear UI by me  :)
- Socket changes emits with callback proof



What could be improved
- 
- Tests (No tests for now, will add in some free time)
- Real monorepo for types sharing
- Swagger
- Dockerize whole app not only mongodb

Some Screenshots
-
![TicTacToe screenshot1](https://imgtr.ee/images/2023/12/31/f523317efc0bafa6f3b46b19dc0d4450.png)

![TicTacToe screenshot2](https://imgtr.ee/images/2023/12/31/a24ee7397b8d8cb3f76b2d6f0460a93d.png)

