const express = require('express');
const helmet = require("helmet");
const morgan = require("morgan")

const userRouter = require("./users/userRouter");
const server = express();

// third party middleware
server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));

server.use("/users", logger, userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  console.log(`${req.method}\n Request to \n${req.originalUrl} at ${Date.now()}`)

  next();
}

module.exports = server;
